@extends('layout')

@section('content')
    <div class="mb-4">
        <h1>Registro Histórico de Ventas</h1>
    </div>
    <div class="table-responsive">
        <table class="table table-white table-hover shadow-sm">
            <thead class="table-warning">
                <tr>
                    <th>ID Venta</th>
                    <th>Vehículo</th>
                    <th>Cliente</th>
                    <th>Vendedor</th>
                    <th>Total Operación</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                @foreach($ventas as $venta)
                <tr>
                    <td>#{{ $venta->id }}</td>
                    <td><strong>{{ $venta->vehiculo->marca }} {{ $venta->vehiculo->modelo }}</strong></td>
                    <td>{{ $venta->cliente->nombre }}</td>
                    <td>{{ $venta->empleado->nombre }}</td>
                    <td><strong>{{ number_format($venta->total, 2, ',', '.') }}€</strong></td>
                    <td>{{ $venta->created_at->format('d/m/Y H:i') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection