<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model {
    protected $fillable = ['cliente_id', 'vehiculo_id', 'empleado_id', 'total'];

    public function cliente() { return $this->belongsTo(Cliente::class); }
    public function vehiculo() { return $this->belongsTo(Vehiculo::class); }
    public function empleado() { return $this->belongsTo(Empleado::class); }
}
