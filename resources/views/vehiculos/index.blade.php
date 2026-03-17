@extends('layout')

@section('content')
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Inventario de Vehículos</h1>
    </div>
    <div class="table-responsive">
        <table class="table table-white table-hover shadow-sm">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Precio</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
                @foreach($vehiculos as $vehiculo)
                <tr>
                    <td>{{ $vehiculo->id }}</td>
                    <td>{{ $vehiculo->marca }}</td>
                    <td>{{ $vehiculo->modelo }}</td>
                    <td>{{ number_format($vehiculo->precio, 2, ',', '.') }}€</td>
                    <td>
                        <span class="badge {{ $vehiculo->stock > 0 ? 'bg-success' : 'bg-danger' }}">
                            {{ $vehiculo->stock }} unidades
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection