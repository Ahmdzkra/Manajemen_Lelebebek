<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Receiving;
use App\Models\ReturnItem;
use App\Models\Sale;
use App\Models\StockOpname;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $period = $request->input('period', '7days');
        $start = $request->input('start');
        $end = $request->input('end');

        return Inertia::render('Dashboard', [
            'role' => $user?->role,
            'stats' => $this->getStats(),
            'latestSales' => $this->getLatestSales(),
            'latestReturns' => ReturnItem::with('product', 'supplier')->latest()->take(5)->get(),
            'latestOpname' => StockOpname::with('product')->latest()->first(),
            'chartData' => $this->getChartData($period, $start, $end),
            'currentPeriod' => $period,
            'currentStart' => $start,
            'currentEnd' => $end,
        ]);
    }

    private function getStats()
    {
        return [
            'products' => Product::sum('stock'),
            'suppliers' => Supplier::count(),
            'users' => User::count(),
            'sales_today' => (float) (Sale::whereDate('created_at', today())->sum('total') + Transaction::whereDate('created_at', today())->sum('total')),
            'receiving_today' => (float) Receiving::whereDate('created_at', today())->sum('total'),
            'returns' => ReturnItem::count(),
            'low_stock' => Product::where('stock', '<', 500)->count(),
            'low_stock_products' => Product::where('stock', '<', 500)->orderBy('stock', 'asc')->get(),
        ];
    }

    private function getLatestSales()
    {
        // Ambil semua data Transactions dengan detail produk
        $transactions = Transaction::with('details.product')->latest()->get()->flatMap(function($t) {
            if ($t->details->isEmpty()) {
                return [[
                    'id'           => 'T'.$t->id,
                    'invoice_no'   => $t->invoice_no,
                    'product_name' => '-',
                    'qty'          => 0,
                    'total'        => (float) $t->total,
                    'payment_method'=> $t->payment_method,
                    'transfer_proof'=> $t->transfer_proof ? asset('storage/' . $t->transfer_proof) : null,
                    'created_at'   => $t->created_at,
                ]];
            }
            return $t->details->map(fn($d) => [
                'id'           => 'T'.$t->id.'-D'.$d->id,
                'invoice_no'   => $t->invoice_no,
                'product_name' => $d->product?->name ?? '-',
                'qty'          => (int) $d->qty,
                'total'        => (float) $d->subtotal,
                'payment_method'=> $t->payment_method,
                'transfer_proof'=> $t->transfer_proof ? asset('storage/' . $t->transfer_proof) : null,
                'created_at'   => $t->created_at,
            ]);
        });

        // Ambil semua data Sales langsung
        $sales = Sale::with('product')->latest()->get()->map(fn($s) => [
            'id'           => 'S'.$s->id,
            'invoice_no'   => 'S-'.$s->id,
            'product_name' => $s->product?->name ?? '-',
            'qty'          => (int) $s->qty,
            'total'        => (float) $s->total,
            'payment_method'=> 'cash',
            'transfer_proof'=> null,
            'created_at'   => $s->created_at,
        ]);

        return $transactions
            ->concat($sales)
            ->sortByDesc('created_at')
            ->values();
    }

    private function getChartData(string $period, ?string $start = null, ?string $end = null): array
    {
        return match ($period) {
            'custom_month' => $this->getCustomMonthData($start, $end),
            '7days'   => $this->getDailyData(7),
            '14days'  => $this->getDailyData(14),
            '30days'  => $this->getDailyData(30),
            'weekly'  => $this->getWeeklyData(),
            'monthly' => $this->getMonthlyData(),
            'yearly'  => $this->getYearlyData(),
            default   => str_starts_with($period, 'day_')
                ? $this->getDayOfWeekData((int) str_replace('day_', '', $period))
                : $this->getDailyData(7),
        };
    }

    private function getDailyData(int $days): array
    {
        return collect(range($days - 1, 0))->map(function ($d) {
            $date = now()->subDays($d);
            $dateStr = $date->toDateString();
            return [
                'date' => $date->translatedFormat('d M'),
                'sales' => (float) (
                    Transaction::whereDate('created_at', $dateStr)->sum('total')
                    + Sale::whereDate('created_at', $dateStr)->sum('total')
                ),
            ];
        })->values()->toArray();
    }

    private function getWeeklyData(): array
    {
        return collect(range(7, 0))->map(function ($w) {
            $start = now()->subWeeks($w)->startOfWeek();
            $end = now()->subWeeks($w)->endOfWeek();
            return [
                'date' => $start->translatedFormat('d M'),
                'sales' => (float) (
                    Transaction::whereBetween('created_at', [$start, $end])->sum('total')
                    + Sale::whereBetween('created_at', [$start, $end])->sum('total')
                ),
            ];
        })->values()->toArray();
    }

    private function getMonthlyData(): array
    {
        return collect(range(11, 0))->map(function ($m) {
            $date = now()->subMonths($m);
            return [
                'date' => $date->translatedFormat('M Y'),
                'sales' => (float) (
                    Transaction::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->sum('total')
                    + Sale::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->sum('total')
                ),
            ];
        })->values()->toArray();
    }

    private function getYearlyData(): array
    {
        return collect(range(4, 0))->map(function ($y) {
            $year = now()->subYears($y)->year;
            return [
                'date' => (string) $year,
                'sales' => (float) (
                    Transaction::whereYear('created_at', $year)->sum('total')
                    + Sale::whereYear('created_at', $year)->sum('total')
                ),
            ];
        })->values()->toArray();
    }

    private function getDayOfWeekData(int $dayOfWeek): array
    {
        // Collect all occurrences of the given day in the last 8 weeks
        return collect(range(7, 0))->map(function ($w) use ($dayOfWeek) {
            $date = now()->subWeeks($w)->startOfWeek()->addDays($dayOfWeek);
            if ($date->isFuture()) return null;
            $dateStr = $date->toDateString();
            return [
                'date' => $date->translatedFormat('d M'),
                'sales' => (float) (
                    Transaction::whereDate('created_at', $dateStr)->sum('total')
                    + Sale::whereDate('created_at', $dateStr)->sum('total')
                ),
            ];
        })->filter()->values()->toArray();
    }

    private function getCustomMonthData(?string $start, ?string $end): array
    {
        if (!$start || !$end) return $this->getDailyData(7);

        try {
            $startDate = Carbon::createFromFormat('Y-m', $start)->startOfMonth();
            $endDate = Carbon::createFromFormat('Y-m', $end)->endOfMonth();
        } catch (\Exception $e) {
            return $this->getDailyData(7);
        }

        $data = [];
        $currentDate = clone $startDate;

        while ($currentDate <= $endDate) {
            $year = $currentDate->year;
            $month = $currentDate->month;

            $data[] = [
                'date' => $currentDate->translatedFormat('M Y'),
                'sales' => (float) (
                    Transaction::whereYear('created_at', $year)->whereMonth('created_at', $month)->sum('total')
                    + Sale::whereYear('created_at', $year)->whereMonth('created_at', $month)->sum('total')
                ),
            ];

            $currentDate->addMonth();
        }

        return $data;
    }
}

