<?php

namespace App\Http\Controllers;
use App\Models\Venta;

class VentaController extends Controller {
    public function index() {
        // Trae las ventas incluyendo el nombre del cliente y del coche
        $ventas = Venta::with(['cliente', 'vehiculo', 'empleado'])->get();
        return view('ventas.index', compact('ventas'));
    }
}