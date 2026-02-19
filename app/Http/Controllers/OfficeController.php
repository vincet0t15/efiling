<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficeController extends Controller
{
    //OFFICES
    public function index(Request $request)
    {
        return Inertia::render('systemSettings/Office/index');
    }
}
