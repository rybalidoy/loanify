<?php

namespace App\Http\Controllers\Loan;

use App\Http\Controllers\Controller;

class LoanController extends Controller
{
  public function index()
  {
    try {
      
    } catch (\Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function store()
  {

  }

  public function update()
  {

  }

  public function changeStatus()
  {

  }

  public function destroy()
  {

  }
}
