<?php

namespace App\Http\Controllers;

use App\Models\Office;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficeController extends Controller
{
    //OFFICES
    public function index(Request $request)
    {

        $search = $request->input('search');
        $offices = Office::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('systemSettings/Office/index', [
            'offices_list' => $offices,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:offices,name',
            'code' => 'required|string|max:255|unique:offices,code',
        ]);

        Office::create($request->all());

        return redirect()->back()->with('success', 'Office created successfully.');
    }
}
