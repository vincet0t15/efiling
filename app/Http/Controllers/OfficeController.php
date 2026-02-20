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
        return Inertia::render('systemSettings/Office/index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
        ]);

        Office::create($request->all());

        return redirect()->back()->with('success', 'Office created successfully.');
    }
}
