<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        // Traemos todos los clientes de la base de datos de Neon
        $clientes = Cliente::all();
        
        // Retornamos la vista (que crearemos luego) con los datos
        return view('clientes.index', compact('clientes'));
    }
}
