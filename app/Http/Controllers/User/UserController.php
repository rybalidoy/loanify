<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

  public function index(Request $request)
  {
    try {
      $page = $request->input('page', 1);
      $perPage = $request->input('pageSize', 25);
      $sortField = $request->input('sortField', 'name');
      $sortDirection = $request->input('sortDirection', 'asc');
      $search = $request->input('search', null);

      $query = User::query()->currentStatus('active');

    } catch(\Throwable $throwable) {
      return response()->json(['message' => $throwable->getMessage(), 500]);
    }
  }

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

  public function changeRole(Request $request, User $userModel)
  {
    $validator = Validator::make($request->all(), [
      'id' => 'required|exists:users,id',
      'role' => 'required|exists:roles,name',
    ]);

    if ($validator->fails()) {
      return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
    }

    try {
      // Find the user
      $user = $userModel->findOrFail($request->id);

      // Check if the role exists
      $role = Role::findByName($request->role);

      // Sync roles (replace existing roles with the new one)
      $user->syncRoles([$role->name]);

      return response()->json(['message' => 'Role updated successfully'], 200);
    } catch (\Exception $e) {
      return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
    }
  }

  
}