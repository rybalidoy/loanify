<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\ModelStatus\HasStatuses;

class Company extends Model
{
  use HasFactory, HasStatuses;

  protected $fillable = [
    'company_code',
    'name',
    'capital',
  ];

}
