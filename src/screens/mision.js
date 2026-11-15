import gameState, { INGRESO_MENSUAL } from "../game-state";
import { tutorialUnaVez, tutorialVisto } from "../robot.js";

export const NODOS = [
  {
    id: "tierra",
    label: "Tierra (Base)",
    position: { x: 20, y: 70 },
    icon: "public",
  },
  {
    id: "luna",
    label: "Órbita Lunar",
    position: { x: 45, y: 45 },
    icon: "satellite_alt",
  },
  {
    id: "marte",
    label: "Marte",
    position: { x: 75, y: 30 },
    icon: "rocket",
  },
];

const CONEXIONES_NODOS = [
  ["tierra", "luna"],
  ["luna", "marte"],
];

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function obtenerNodosConectados(idNodo) {
  return CONEXIONES_NODOS.flatMap(([origen, destino]) => {
    if (origen === idNodo) return [destino];
    if (destino === idNodo) return [origen];
    return [];
  });
}

function renderizarNodos() {
  const contenedorNodos = document.getElementById("mapa-nodos");
  const contenedorConexiones = document.getElementById("conexiones-nodos");

  if (!contenedorNodos || !contenedorConexiones) {
    throw new Error("No se encontraron los contenedores del mapa de misiones.");
  }

  const nodosPorId = new Map(NODOS.map((nodo) => [nodo.id, nodo]));
  contenedorNodos.replaceChildren();
  contenedorConexiones.replaceChildren();

  CONEXIONES_NODOS.forEach(([origenId, destinoId]) => {
    const origen = nodosPorId.get(origenId);
    const destino = nodosPorId.get(destinoId);

    if (!origen || !destino) {
      throw new Error(
        `La conexión "${origenId}-${destinoId}" referencia un nodo inexistente.`,
      );
    }

    const linea = document.createElementNS(SVG_NAMESPACE, "line");
    linea.setAttribute("x1", origen.position.x);
    linea.setAttribute("y1", origen.position.y);
    linea.setAttribute("x2", destino.position.x);
    linea.setAttribute("y2", destino.position.y);
    linea.classList.add("nodo-conexion");
    contenedorConexiones.append(linea);
  });

  NODOS.forEach((nodo) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "nodo-estelar";
    boton.dataset.nodo = nodo.id;
    boton.style.left = `${nodo.position.x}%`;
    boton.style.top = `${nodo.position.y}%`;
    boton.setAttribute("aria-label", nodo.label);

    const icono = document.createElement("span");
    icono.className = "material-symbols-outlined nodo-icon";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = nodo.icon;

    const etiqueta = document.createElement("span");
    etiqueta.className = "nodo-nombre";
    etiqueta.textContent = nodo.label;

    boton.append(icono, etiqueta);
    contenedorNodos.append(boton);
  });

  return contenedorNodos.querySelectorAll(".nodo-estelar");
}

let observadorTutorial = null;
const grupoHUD = (id) => () =>
  document.getElementById(id)?.parentElement?.parentElement;

function lanzarTutorialCuandoSeVea(contenedor) {
  observadorTutorial?.disconnect();
  if (tutorialVisto("mapa-intro")) return;

  observadorTutorial = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    observadorTutorial.disconnect();

    setTimeout(() => {
      tutorialUnaVez("mapa-intro", {
        pasos: [
          {
            texto: "¡Hola! Soy tu robot ayudante. Te explico el mapa.",
            expresion: "saludo",
          },
          {
            texto: "Esta es tu plata. Con ella comprás mejoras para tus misiones. ¡No la gastes toda junta!",
            resaltar: grupoHUD("hud-presupuesto"),
          },
          {
            texto: "Esto es la ciencia. Sirve para mejoras especiales.",
            resaltar: grupoHUD("hud-ciencia"),
          },
          {
            texto: `Cada mes te llegan $${INGRESO_MENSUAL.presupuesto} y ${INGRESO_MENSUAL.ciencia} de ciencia gratis.`,
            expresion: "pensando",
          },
          "Cada círculo del mapa es una misión. Los apagados todavía están bloqueados.",
          "¡Empecemos! Tocá la Tierra para tu primera misión.",
        ],
        objetivo: () => contenedor.querySelector('[data-nodo="tierra"]'),
      });
    }, 500);
  });
  observadorTutorial.observe(contenedor);
}
export default function inicializarMision({ onIniciarMision, onVolver }) {
  const btnVolver = document.getElementById("btn-mision-volver");
  const nodosEstelares = renderizarNodos();

  const hudPresupuesto = document.getElementById("hud-presupuesto");
  const hudCiencia = document.getElementById("hud-ciencia");
  const hudIngresoPresupuesto = document.getElementById(
    "hud-ingreso-presupuesto",
  );
  const hudIngresoCiencia = document.getElementById("hud-ingreso-ciencia");

  hudIngresoPresupuesto.textContent = INGRESO_MENSUAL.presupuesto.toLocaleString(
    "es-AR",
  );
  hudIngresoCiencia.textContent = INGRESO_MENSUAL.ciencia.toLocaleString(
    "es-AR",
  );

  function actualizarHUD() {
    const partida = gameState.obtenerSlotActual();
    if (partida) {
      if (hudPresupuesto)
        hudPresupuesto.textContent = partida.presupuesto ?? 1000;
      if (hudCiencia) hudCiencia.textContent = partida.ciencia ?? 0;
    }
  }

  function actualizarNodosVisuales() {
    const partida = gameState.obtenerSlotActual();
    if (!partida) return;

    const desbloqueados = partida.desbloqueados || ["tierra"];
    const nodoActual = partida.nodoActual || "tierra";
    const accesiblesPorConexiones = new Set(
      (partida.completados || []).flatMap(obtenerNodosConectados),
    );

    nodosEstelares.forEach((nodoEl) => {
      const idNodo = nodoEl.dataset.nodo;

      nodoEl.classList.remove("desbloqueado", "disponible", "bloqueado");

      if (idNodo === nodoActual) {
        nodoEl.classList.add("desbloqueado");
        nodoEl.title = "Nodo actual";
      } else if (
        desbloqueados.includes(idNodo) ||
        accesiblesPorConexiones.has(idNodo)
      ) {
        nodoEl.classList.add("disponible");
        nodoEl.title = "Nodo disponible para explorar";
      } else {
        nodoEl.classList.add("bloqueado");
        nodoEl.title = "Nodo bloqueado";
      }
    });
  }

  actualizarHUD();
  actualizarNodosVisuales();
  lanzarTutorialCuandoSeVea(document.getElementById("mapa-nodos"));

  nodosEstelares.forEach((nodoEl) => {
    nodoEl.onclick = () => {
      const idNodo = nodoEl.dataset.nodo;
      const partida = gameState.obtenerSlotActual();
      if (!partida) {
        throw new Error("No hay una campaña activa para iniciar una misión.");
      }

      const desbloqueados = partida.desbloqueados || ["tierra"];
      const accesiblesPorConexiones = new Set(
        (partida.completados || []).flatMap(obtenerNodosConectados),
      );
      const puedeAcceder =
        desbloqueados.includes(idNodo) ||
        accesiblesPorConexiones.has(idNodo) ||
        idNodo === partida.nodoActual;

      if (!puedeAcceder) return;

      console.log(`Seleccionado nodo de misión: ${idNodo}`);

      gameState.actualizarSlotActual({ nodoActual: idNodo });

      if (onIniciarMision) {
        onIniciarMision(idNodo);
      }
    };
  });

  if (btnVolver) {
    btnVolver.onclick = () => {
      if (onVolver) onVolver();
    };
  }
}
