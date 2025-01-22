<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\ModelStatus\HasStatuses;

class Company extends Model
{
  use HasFactory, HasStatuses;

  protected $fillable = [
    'company_id',
    'name',
    'capital',
  ];

  protected static function boot()
  {
    parent::boot();

    static::creating(function ($company) {
      $company->company_id = now()->format('dmy') . strtoupper($company->company_id);
      $company->name = strtolower($company->name);
    });

    static::updating(function ($company) {
      if ($company->isDirty('tag')) {
        $company->company_id = now()->format('dmy') . strtoupper($company->tag);
      }
    });
  }

}
