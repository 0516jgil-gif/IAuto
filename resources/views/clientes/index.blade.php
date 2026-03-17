@extends('layout')

@section('content')
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Nuestros Clientes</h1>
    </div>
    <div class="table-responsive">
        <table class="table table-white table-hover shadow-sm">
            <thead class="table-primary">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                @foreach($clientes as $cliente)
                <tr>
                    <td>{{ $cliente->id }}</td>
                    <td>{{ $cliente->nombre }}</td>
                    <td>{{ $cliente->dni }}</td>
                    <td>{{ $cliente->email }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection