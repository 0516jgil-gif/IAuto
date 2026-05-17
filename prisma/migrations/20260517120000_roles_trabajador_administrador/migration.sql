-- Rename the old operational admin role to trabajador and keep one superior administrator.
UPDATE "Empleado"
SET "rol" = 'administrador'
WHERE "id" = (
  SELECT MIN("id")
  FROM "Empleado"
  WHERE "rol" = 'admin'
);

UPDATE "Empleado"
SET "rol" = 'trabajador'
WHERE "rol" = 'admin';
