import gameState, { INVESTIGACION_INICIAL } from "../../game-state.js";

export const NODOS_INVESTIGACION = [
  {
    id: INVESTIGACION_INICIAL,
    label: "Fundamentos científicos",
    position: { x: 16, y: 50 },
    icon: "science",
    costo: 0,
  },
  {
    id: "cartografia_orbital",
    label: "Cartografía orbital",
    position: { x: 40, y: 23 },
    icon: "public",
    costo: 20,
  },
  {
    id: "materiales_avanzados",
    label: "Materiales avanzados",
    position: { x: 40, y: 77 },
    icon: "category",
    costo: 25,
  },
  {
    id: "propulsion_electrica",
    label: "Propulsión eléctrica",
    position: { x: 65, y: 23 },
    icon: "rocket_launch",
    costo: 40,
  },
  {
    id: "soporte_vida",
    label: "Soporte de vida",
    position: { x: 65, y: 77 },
    icon: "air",
    costo: 40,
  },
  {
    id: "exploracion_profunda",
    label: "Exploración profunda",
    position: { x: 88, y: 50 },
    icon: "travel_explore",
    costo: 60,
  },
];

export const CONEXIONES_INVESTIGACION = [
  [INVESTIGACION_INICIAL, "cartografia_orbital"],
  [INVESTIGACION_INICIAL, "materiales_avanzados"],
  ["cartografia_orbital", "propulsion_electrica"],
  ["materiales_avanzados", "soporte_vida"],
  ["propulsion_electrica", "exploracion_profunda"],
  ["soporte_vida", "exploracion_profunda"],
];

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function obtenerPartida() {
  const partida = gameState.obtenerSlotActual();
  if (!partida) {
    throw new Error("No hay una campaña activa para mostrar la investigación.");
  }

  return partida;
}

function renderizarArbol(contenedorNodos, contenedorConexiones) {
  const nodosPorId = new Map(
    NODOS_INVESTIGACION.map((nodo) => [nodo.id, nodo]),
  );
  contenedorNodos.replaceChildren();
  contenedorConexiones.replaceChildren();

  CONEXIONES_INVESTIGACION.forEach(([origenId, destinoId]) => {
    const origen = nodosPorId.get(origenId);
    const destino = nodosPorId.get(destinoId);

    if (!origen || !destino) {
      throw new Error(
        `La conexión de investigación "${origenId}-${destinoId}" referencia un nodo inexistente.`,
      );
    }

    const linea = document.createElementNS(SVG_NAMESPACE, "line");
    linea.setAttribute("x1", origen.position.x);
    linea.setAttribute("y1", origen.position.y);
    linea.setAttribute("x2", destino.position.x);
    linea.setAttribute("y2", destino.position.y);
    linea.classList.add("investigacion-conexion");
    contenedorConexiones.append(linea);
  });

  NODOS_INVESTIGACION.forEach((nodo) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "investigacion-nodo";
    boton.dataset.investigacion = nodo.id;
    boton.style.left = `${nodo.position.x}%`;
    boton.style.top = `${nodo.position.y}%`;
    boton.setAttribute(
      "aria-label",
      `${nodo.label}, costo ${nodo.costo} puntos`,
    );

    const icono = document.createElement("span");
    icono.className = "material-symbols-outlined investigacion-nodo-icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = nodo.icon;

    const nombre = document.createElement("strong");
    nombre.className = "investigacion-nodo-nombre";
    nombre.textContent = nodo.label;

    const costo = document.createElement("span");
    costo.className = "investigacion-nodo-costo";
    costo.textContent = nodo.costo === 0 ? "Inicial" : `${nodo.costo} puntos`;

    boton.append(icono, nombre, costo);
    contenedorNodos.append(boton);
  });
}

export default function inicializarInvestigacion({ onResourcesChanged }) {
  const contenedorNodos = document.getElementById("nodos-investigacion");
  const contenedorConexiones = document.getElementById(
    "conexiones-investigacion",
  );
  const mensaje = document.getElementById("investigacion-mensaje");

  if (!contenedorNodos || !contenedorConexiones || !mensaje) {
    throw new Error(
      "No se encontraron los elementos del árbol de investigación.",
    );
  }

  renderizarArbol(contenedorNodos, contenedorConexiones);

  function nodosCompletados(partida) {
    return new Set(
      partida.investigacionesCompletadas ?? [INVESTIGACION_INICIAL],
    );
  }

  function actualizarNodos() {
    const partida = obtenerPartida();
    const completados = nodosCompletados(partida);
    const disponibles = new Set(
      CONEXIONES_INVESTIGACION.flatMap(([origen, destino]) =>
        completados.has(origen) ? [destino] : [],
      ),
    );

    contenedorNodos
      .querySelectorAll("[data-investigacion]")
      .forEach((boton) => {
        const nodo = NODOS_INVESTIGACION.find(
          ({ id }) => id === boton.dataset.investigacion,
        );
        const investigado = completados.has(nodo.id);
        const conectado = disponibles.has(nodo.id);

        boton.classList.toggle("investigacion-completada", investigado);
        boton.classList.toggle(
          "investigacion-disponible",
          !investigado &&
            conectado &&
            Number(partida.ciencia ?? 0) >= nodo.costo,
        );
        boton.classList.toggle(
          "investigacion-insuficiente",
          !investigado &&
            conectado &&
            Number(partida.ciencia ?? 0) < nodo.costo,
        );
        boton.classList.toggle(
          "investigacion-bloqueada",
          !investigado && !conectado,
        );
        boton.title = investigado
          ? "Investigación completada"
          : conectado
            ? `Desbloquear por ${nodo.costo} puntos de investigación`
            : "Completa una investigación conectada para desbloquear este nodo";
      });
  }

  contenedorNodos.onclick = (evento) => {
    const objetivo =
      evento.target instanceof Element ? evento.target : null;
    const boton = objetivo?.closest("[data-investigacion]");
    if (!boton || !contenedorNodos.contains(boton)) return;

    const nodo = NODOS_INVESTIGACION.find(
      ({ id }) => id === boton.dataset.investigacion,
    );
    const partida = obtenerPartida();
    const completados = nodosCompletados(partida);

    if (completados.has(nodo.id)) {
      mensaje.textContent = `${nodo.label} ya está completada.`;
      return;
    }

    const conectado = CONEXIONES_INVESTIGACION.some(
      ([origen, destino]) =>
        destino === nodo.id && completados.has(origen),
    );
    if (!conectado) {
      mensaje.textContent =
        "Completa una investigación conectada para desbloquear este nodo.";
      return;
    }

    const puntosCiencia = Number(partida.ciencia ?? 0);
    if (puntosCiencia < nodo.costo) {
      mensaje.textContent = `Necesitas ${nodo.costo} puntos de investigación para desbloquear ${nodo.label}.`;
      return;
    }

    const partidaActualizada = gameState.actualizarSlotActual({
      ciencia: puntosCiencia - nodo.costo,
      investigacionesCompletadas: [...completados, nodo.id],
    });
    if (!partidaActualizada) {
      throw new Error(`No se pudo completar la investigación "${nodo.label}".`);
    }

    mensaje.textContent = `${nodo.label} completada.`;
    actualizarNodos();
    onResourcesChanged();
  };

  actualizarNodos();
  return actualizarNodos;
}
