@extends('layout')

@section('content')
    <div class="mb-4">
        <h1>Equipo de Ventas</h1>
    </div>
    <div class="table-responsive">
        <table class="table table-white table-hover shadow-sm">
            <thead class="table-success">
                <tr>
                    <th>ID</th>
                    <th>Nombre del Empleado</th>
                    <th>Código Interno</th>
                    <th>Fecha Alta</th>
                </tr>
            </thead>
            <tbody>
                @foreach($empleados as $empleado)
                <tr>
                    <td>{{ $empleado->id }}</td>
                    <td>{{ $empleado->nombre }}</td>
                    <td><code>{{ $empleado->codigo_empleado }}</code></td>
                    <td>{{ $empleado->created_at->format('d/m/Y') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection