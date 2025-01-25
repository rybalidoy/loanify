<?php

namespace App\Models;

use App\Traits\HasCustomStatuses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\ModelStatus\HasStatuses;

class Company extends Model
{
  use HasFactory, HasStatuses, HasCustomStatuses;

  protected $fillable = [
    'company_code',
    'name',
    'capital',
  ];

  public function employees()
  {
    return $this->hasMany(User::class);
  }
}
