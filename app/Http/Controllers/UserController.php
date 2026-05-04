<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at->format('d M Y H:i'),
                ];
            });

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        //
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();
        
        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'User berhasil diperbarui.');
    }

    public function resetPassword(User $user)
    {
        $newPassword = Str::password(12);

        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        return back()->with(
            'success',
            'Password baru user: ' . $newPassword
        );
    }

    public function destroy(User $user)
    {
        if (Auth::id() === $user->id) {
            return back()->with(
                'error',
                'Anda tidak bisa menghapus akun sendiri.'
            );
        }

        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
