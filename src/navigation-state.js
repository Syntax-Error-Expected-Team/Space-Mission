const CLAVE_NAVEGACION = "spaceMission:navegacion";
const PANTALLAS_VALIDAS = new Set([
  "pantalla-menu",
  "pantalla-slots",
  "pantalla-mision",
  "pantalla-juego",
]);
const VISTAS_JUEGO_VALIDAS = new Set([
  "misionTree",
  "taller",
  "investigacion",
]);
const CATEGORIAS_INVESTIGACION_VALIDAS = new Set([
  "propulsion",
  "combustible",
  "control",
  "carga-util",
  "estructura",
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
        : "misionTree",
      categoriaInvestigacion: CATEGORIAS_INVESTIGACION_VALIDAS.has(
        navegacion.categoriaInvestigacion,
      )
        ? navegacion.categoriaInvestigacion
        : "propulsion",
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
      vista: navegacion?.vista ?? "misionTree",
      categoriaInvestigacion:
        navegacion?.categoriaInvestigacion ?? "propulsion",
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
      categoriaInvestigacion:
        navegacion?.categoriaInvestigacion ?? "propulsion",
    }),
  );
}

export function guardarCategoriaInvestigacion(categoria) {
  if (!CATEGORIAS_INVESTIGACION_VALIDAS.has(categoria)) {
    throw new Error(`La categoría de investigación "${categoria}" no es válida.`);
  }

  const navegacion = obtenerNavegacionGuardada();
  localStorage.setItem(
    CLAVE_NAVEGACION,
    JSON.stringify({
      pantalla: navegacion?.pantalla ?? "pantalla-juego",
      vista: navegacion?.vista ?? "investigacion",
      categoriaInvestigacion: categoria,
    }),
  );
}
