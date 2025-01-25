<?php

namespace App\Http\Controllers\Company;

use App\Http\Requests\StoreCompanyRequest;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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

      $query = Company::query()->bindLatestStatus();

      if ($search) {
        $query->where('companies.name', 'like', "%{$search}%")
          ->orWhere('companies.company_code', 'like', "%{$search}%");
      }

      $companies = $query->orderBy($sortField, $sortDirection)
        ->paginate($perPage, ['*'], 'page', $page);

      return response()->json($companies);
    } catch (\Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function show(Company $company)
  {
    try {
      return response()->json($company);
    } catch (Throwable $throwable) {
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  public function store(StoreCompanyRequest $request, Company $company)
  {
    try {
      $validatedData = $request->validated();
      $company->capital = $validatedData['capital'] ?? 0;
      $company->name = $validatedData['name'];
      $company->company_code = $this->generateCompanyCode();
      $company->save();
      $company->setStatus('active', 'created');
      return response()->json(['message' => 'Company created successfully', 'company' => $company], 201);
    } catch (Throwable $throwable) {
      return response()->json(['message' => 'Internal server error: ', $throwable->getMessage()], 500);
    }
  }

  public function update(StoreCompanyRequest $request, Company $company)
  {
    try {
      $company->company_code = $request->company_code;
      $company->name = $request->name;
      $company->capital = $request->capital;
      $company->save();
    } catch (Throwable $throwable) {
      dd($throwable->getMessage());
      return response()->json(['message' => 'Internal server error', 500]);
    }
  }

  public function changeStatus(Request $request, Company $company)
  {
    $request->validate([
      'status' => 'required|string',
      'reason' => 'nullable|string',
    ]);

    try {
      $company->setStatus($request->status, $request->reason);
      $company->save();

      return response()->json(['message' => 'Company status changed successfully'], 200);
    } catch (Throwable $throwable) {
      dd($throwable->getMessage());
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  public function destroy(Company $company)
  {
    try {
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

  protected function generateCompanyCode()
  {
    $code = Str::upper(Str::random(11));
    return response()->json(['code' => $code]);
  }
}