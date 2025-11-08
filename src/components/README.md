# Convención contenedor/vista

Este proyecto adopta una separación explícita entre lógica (contenedores) y presentación (vistas) dentro de `src/components` para mejorar mantenibilidad, testabilidad y escalabilidad.

## Estructura

Cada componente vive en una carpeta con dos archivos principales:

- `index.jsx`: Contenedor. Orquesta estado, efectos, navegación, llamadas a servicios/repositorios y pasa datos/handlers a la vista vía props.
- `View.jsx`: Vista. Renderiza únicamente JSX y estilos. No contiene efectos ni acceso a proveedores (Firebase, router, etc.).
- Fachada en `src/components/Nombre.jsx` que reexporta el contenedor para conservar rutas de importación existentes.

Ejemplo:

```
src/components/
  Dashboard.jsx           # fachada
  Dashboard/
    index.jsx             # contenedor
    View.jsx              # vista
```

## Reglas

- La vista no hace `useEffect`, no accede a Firebase, ni usa `useNavigate`. Solo recibe props.
- El contenedor puede usar hooks, servicios de dominio e infraestructura, y transformar datos antes de pasarlos a la vista.
- Los estilos se referencian desde la vista. El contenedor no aplica estilos salvo casos excepcionales.
- Preferir pasar funciones puras y datos serializables entre contenedor y vista.

## Beneficios

- Facilita pruebas: tests de snapshot para vistas y tests lógicos para contenedores/servicios.
- Reduce acoplamiento a proveedores: cambios en Firebase o router no impactan la UI.
- Mejora la legibilidad y la colaboración al delimitar responsabilidades.

## Próximos pasos sugeridos

- Añadir PropTypes o migrar a TypeScript para tipar props de las vistas.
- Extraer reglas de negocio a `src/domain/services` y acceso a datos a `src/infrastructure/api`.
- Incorporar tests de humo para contenedores y vistas.
