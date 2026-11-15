const CLAVE_NAVEGACION = "spaceMission:navegacion";
const PANTALLAS_VALIDAS = new Set([
  "pantalla-menu",
  "pantalla-slots",
  "pantalla-mision",
  "pantalla-juego",
]);
const VISTAS_JUEGO_VALIDAS = new Set([
  "base",
  "taller",
  "investigacion",
]);

export function obtenerNavegacionGuardada() {
  try {
    const navegacion = JSON.parse(
      localStorage.getItem(CLAVE_NAVEGACION) ?? "null",
    );
    if (!PANTALLAS_VALIDAS.has(navegacion?.pantalla)) return null;
    return {
      pantalla: navegacion.pantalla,
      vista: VISTAS_JUEGO_VALIDAS.has(navegacion.vista)
        ? navegacion.vista
        : "base",
    };
  } catch {
    return null;
  }
}

export function guardarPantallaActual(pantalla) {
  if (!PANTALLAS_VALIDAS.has(pantalla)) {
    throw new Error(`La pantalla "${pantalla}" no es válida.`);
  }

  const navegacion = obtenerNavegacionGuardada();
  localStorage.setItem(
    CLAVE_NAVEGACION,
    JSON.stringify({
      pantalla,
      vista: navegacion?.vista ?? "base",
    }),
  );
}

export function guardarVistaJuego(vista) {
  if (!VISTAS_JUEGO_VALIDAS.has(vista)) {
    throw new Error(`La vista de juego "${vista}" no es válida.`);
  }

  const navegacion = obtenerNavegacionGuardada();
  localStorage.setItem(
    CLAVE_NAVEGACION,
    JSON.stringify({
      pantalla: navegacion?.pantalla ?? "pantalla-juego",
      vista,
    }),
  );
}
