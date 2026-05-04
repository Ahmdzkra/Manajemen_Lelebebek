<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_report_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this
            ->actingAs($admin)
            ->get('/report');

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Reports/Index')
                ->has('summary')
                ->has('filters')
            );
    }

    public function test_cashier_cannot_view_report_page(): void
    {
        $cashier = User::factory()->create([
            'role' => 'cashier',
        ]);

        $this
            ->actingAs($cashier)
            ->get('/report')
            ->assertForbidden();
    }

    public function test_admin_can_view_print_report_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this
            ->actingAs($admin)
            ->get('/report/print');

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Reports/Print')
                ->has('summary')
                ->has('filters')
            );
    }
}
