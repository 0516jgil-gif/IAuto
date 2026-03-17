<?php

namespace App\Http\Controllers;
use App\Models\Vehiculo;

class VehiculoController extends Controller {
    public function index() {
        $vehiculos = Vehiculo::all();
        return view('vehiculos.index', compact('vehiculos'));
    }
}