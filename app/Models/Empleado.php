<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model {
    protected $fillable = ['nombre', 'codigo_empleado'];
    public function ventas() { return $this->hasMany(Venta::class); }
}
