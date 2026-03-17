<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IAuto - Gestión</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container">
            <a class="navbar-brand" href="/">IAuto</a>
            <div class="navbar-nav">
                <a class="nav-link" href="/vehiculos">Vehículos</a>
                <a class="nav-link" href="/clientes">Clientes</a>
                <a class="nav-link" href="/empleados">Empleados</a>
                <a class="nav-link" href="/ventas">Ventas</a>
            </div>
        </div>
    </nav>
    <div class="container">
        @yield('content')
    </div>
</body>
</html>