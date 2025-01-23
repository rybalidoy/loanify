<?php

namespace App\Http\Controllers\Company;

use App\Http\Requests\StoreCompanyRequest;
use App\Models\Company;
use Illuminate\Http\Request;
use Throwable;

class CompanyController
{
  public function index(Request $request)
  {
    try {
      $page = $request->input('page', 1);
      $perPage = $request->input('pageSize', 25);
      $sortField = $request->input('sortField', 'name');
      $sortDirection = $request->input('sortDirection', 'asc');
      $search = $request->input('search', null);

      $query = Company::query()
        ->whereHas('statuses', function ($query) {
          $query->where('name', 'active');
        });

      if ($search) {
        $query->where('name', 'like', "%{$search}%")
          ->orWhere('company_code', 'like', "%{$search}%");
      }

      $companies = $query->orderBy($sortField, $sortDirection)
        ->paginate($perPage, ['*'], 'page', $page);

      $companies->getCollection()->transform(function ($company) {
        $company->current_status = $company->status; // Access the current status
        return $company;
      });

      return $companies;
    } catch (\Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function show($id)
  {
    try {
      $company = Company::findOrFail($id);
      return response()->json($company);
    } catch (Throwable $throwable) {
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  public function store(StoreCompanyRequest $request)
  {
    try {
      $validatedData = $request->validated();
      $company = new Company();
      $company->capital = $validatedData['capital'] ?? 0;
      $company->name = $validatedData['name'];
      $company->company_code = $validatedData['company_code'];
      $company->save();
      $company->setStatus('active', 'created');
      return response()->json(['message' => 'Company created successfully', 'company' => $company], 201);
    } catch (Throwable $throwable) {
      return response()->json(['message' => 'Internal server error: ', $throwable->getMessage()], 500);
    }
  }

  public function update(StoreCompanyRequest $request)
  {
    try {
      $company = Company::findOrFail($request->id);
      $company->tag = $request->tag;
      $company->name = $request->name;
      $company->capital = $request->capital;
      $company->save();
    } catch (Throwable $throwable) {
      return response()->json(['message' => 'Interal server error', 500]);
    }
  }

  public function changeStatus(Request $request, $id)
  {
    try {
      $company = Company::findOrFail($id);
      $company->status();
      $company->setStatus($request->status, $request->reason);
      $company->save();
      return response()->json(['message' => 'Company status changed successfully'], 200);
    } catch (Throwable $throwable) {
      return response()->json(['message' => 'Internal server error: ', $throwable->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    try {
      $company = Company::findOrFail($id);
      $company->delete();
      return response()->json(['message' => 'Company deleted successfully'], 200);
    } catch (Throwable $throwable) {
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  public function search(Request $request)
  {
    try {
      $search = $request->input('search');
      $companies = Company::where('name', 'like', "%{$search}%")
        ->orWhere('company_id', 'like', "%{$search}%")
        ->get();
      return response()->json($companies);
    } catch (Throwable $throwable) {
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  // public function generateCompanyCode(Request $request)
  // {
  //   try {
  //     $companyService = new CompanyService();
  //   }
  // }
}