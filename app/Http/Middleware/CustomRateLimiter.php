<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class CustomRateLimiter
{
  public function handle(Request $request, Closure $next, $maxAttempts = null, $decaySeconds = null)
  {
    $maxAttempts = $maxAttempts ?? config('throttle.limits.default_max_attempts');
    $decaySeconds = $decaySeconds ?? config('throttle.limits.default_decay_seconds');

    $key = $this->resolveKey($request);

    $currentAttempts = Cache::get("$key:attempts", 0);
    $expiresAt = Cache::get("$key:expiration", now()->timestamp);

    if ($expiresAt <= now()->timestamp) {
      $currentAttempts = 0;
      $expiresAt = now()->addSeconds($decaySeconds)->timestamp;
    }

    $currentAttempts++;

    Cache::put("$key:attempts", $currentAttempts, Carbon::createFromTimestamp($expiresAt));
    Cache::put("$key:expiration", $expiresAt, Carbon::createFromTimestamp($expiresAt));

    $retryAfter = max(0, $expiresAt - now()->timestamp);

    if ($currentAttempts > $maxAttempts) {
      return response()->json([
        'message' => 'Too many requests. Please try again later.',
        'ip' => $this->resolveIp($request),
        'max_attempts' => $maxAttempts,
        'retry_after_seconds' => $retryAfter,
      ], 429);
    }

    $remainingAttempts = max(0, $maxAttempts - $currentAttempts);

    $response = $next($request);

    return $response
      ->header('X-RateLimit-Limit', $maxAttempts)
      ->header('X-RateLimit-Remaining', $remainingAttempts)
      ->header('X-RateLimit-Reset', $retryAfter);
  }

  protected function resolveKey(Request $request)
  {
    $ip = $this->resolveIp($request);
    $routeName = $request->route()->getName() ?? 'default';
    return sprintf('rate_limit:%s:%s', $ip, $routeName);
  }

  protected function resolveIp(Request $request)
  {
    if ($request->hasHeader('X-Forwarded-For')) {
      $forwardedIps = explode(',', $request->header('X-Forwarded-For'));
      return trim($forwardedIps[0]);
    }

    if ($request->hasHeader('X-Real-IP')) {
      return $request->header('X-Real-IP');
    }

    return $request->ip();
  }
}
