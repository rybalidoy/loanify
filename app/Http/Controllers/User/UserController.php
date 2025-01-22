<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  public function store(CreateUserRequest $request, User $userModel) 
  {
    try {
      $validated = $request->validated();
      $validated['email'] = strtolower($validated['email']);
      $validated['username'] = strtolower($validated['username']);
      $validated['first_name'] = ucfirst($validated['first_name']);
      $validated['last_name'] = ucfirst($validated['last_name']);
      $validated['middle_name'] = ucfirst($validated['middle_name']);
      $validated['password'] = Hash::make($validated['password']);
      return response()->json($userModel->create($validated));
    } catch (\Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }
}