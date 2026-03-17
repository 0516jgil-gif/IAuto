<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\EmpleadoController;

Route::get('/catalogo', [VehiculoController::class, 'index']);
Route::get('/historial-ventas', [VentaController::class, 'index']);
Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
Route::get('/empleados', [EmpleadoController::class, 'index'])->name('empleados.index');