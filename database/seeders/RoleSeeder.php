<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create roles
        $roles = [
            'owner',
            'administrator',
            'payroll_officer',
            'employee',
        ];

        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }
    }
}