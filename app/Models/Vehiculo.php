<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model {
    protected $fillable = ['marca', 'modelo', 'precio', 'stock'];
    public function ventas() { return $this->hasMany(Venta::class); }
}