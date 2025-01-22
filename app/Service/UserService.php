<?php

namespace App\Service;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
  protected $userModel;

  public function __construct(User $user)
  {
    $this->userModel = $user;
  }

  public function authenticate($credentials)
  {
    $user = $this->userModel->where('email', $credentials['email'])->first();
    if ($user && Hash::check($credentials['password'], $user->password)) {
      return $user;
    }
    return null;
  }
}
