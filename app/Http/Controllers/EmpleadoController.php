<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    public function index()
    {
        // Traemos todos los empleados
        $empleados = Empleado::all();
        
        return view('empleados.index', compact('empleados'));
    }
}
