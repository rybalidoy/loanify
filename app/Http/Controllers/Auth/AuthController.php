<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Service\UserService;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends Controller
{
  public function login(AuthRequest $request, UserService $userService)
  {
    $authenticatedUser = $userService->authenticate($request->validated());
    if (!$authenticatedUser) {
      return response()->json(['message' => 'Email address or password is invalid.']);
    }
    $existingToken = $authenticatedUser->tokens->first();
    if ($existingToken) {
      $existingToken->delete();
    }

    $token = $authenticatedUser->createToken('user_auth')->plainTextToken;
    return response()->json([
      'message' => 'Login successful',
      'sanctum_token' => $token
    ]);
  }

  public function logout(Request $request)
  {
    $user = $request->user()->currentAccessToken()->delete();
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'User successfully logged out']);
  }

  public function authUser(Request $request)
  {
    try {
      $user = $request->user();
      $user->name = $user->first_name . ' ' . $user->last_name;
      if ($user) {
        return response()->json([
          'message' => 'Authenticated',
          'user' => $user,
          'authenticated' => true
        ]);
      }
      return response()->json([
        'message' => 'Unathenticated',
        'authenticated' => false
      ]);
    } catch (Throwable $throwable) {
      return response()->json(['error' => $throwable->getMessage()]);
    }
  }
}
