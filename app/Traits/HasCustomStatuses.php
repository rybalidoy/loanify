<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasCustomStatuses
{
  /**
   * Scope to bind the latest status to the query.
   *
   * @param \Illuminate\Database\Eloquent\Builder $query
   * @return \Illuminate\Database\Eloquent\Builder
   */
  public function scopeBindLatestStatus(Builder $query): Builder
  {
    $statusTable = $this->getStatusTableName();
    $modelKeyColumn = $this->getModelKeyColumnName();
    $modelType = $this->getStatusModelType();

    return $query->leftJoin($statusTable, function ($join) use ($statusTable, $modelKeyColumn, $modelType) {
      $join->on($this->getQualifiedKeyName(), '=', "{$statusTable}.{$modelKeyColumn}")
           ->where("{$statusTable}.model_type", '=', $modelType)
           ->whereRaw("{$statusTable}.id = (select max(id) from {$statusTable} where {$statusTable}.{$modelKeyColumn} = {$this->getQualifiedKeyName()} and {$statusTable}.model_type = ?)", [$modelType]);
    })
    ->select("{$this->getTable()}.*", "{$statusTable}.name as current_status");
  }
}