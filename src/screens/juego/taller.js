export default function inicializarTaller() {
  const contenido = document.getElementById("taller-contenido");

  if (!contenido) {
    throw new Error("No se encontró el contenido de la vista Taller.");
  }

  return function actualizarTaller() {
    const estadoVacio = document.createElement("div");
    estadoVacio.className = "juego-tarjeta taller-estado-vacio";

    const icono = document.createElement("span");
    icono.className = "material-symbols-outlined";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = "construction";

    const mensaje = document.createElement("p");
    mensaje.textContent =
      "Todavía no hay proyectos en el taller. Las mejoras estarán disponibles próximamente.";

    estadoVacio.append(icono, mensaje);
    contenido.replaceChildren(estadoVacio);
  };
}
