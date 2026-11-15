import gameState, { INGRESO_MENSUAL } from "../game-state.js";
import inicializarBase from "./juego/misionTree.js";
import inicializarTaller from "./juego/taller.js";
import inicializarInvestigacion from "./juego/investigacion.js";
import { mostrarDialogoInformacion } from "./juego/informacion.js";
import { guardarVistaJuego } from "../navigation-state.js";
import { tutorialCuandoSeVea } from "../robot.js";
const visible = (e) => (e && e.getBoundingClientRect().width > 0 ? e : null);

function lanzarTutorialCentro() {
  const panel = document.querySelector('[data-juego-panel="misionTree"]');
  if (!panel) return;

  tutorialCuandoSeVea("centro-intro", panel, {
    pasos: [
      { texto: "¡Este es el Centro de mando! Desde acá manejás todo.", expresion: "saludo" },
      {
        texto: "Acá ves tu plata y tus puntos de investigación. Cada misión te cuesta recursos.",
        resaltar: () => visible(document.getElementById("juego-presupuesto")?.closest(".juego-hud, header")),
      },
      {
        texto: "En Misiones elegís qué hacer. Es donde estás ahora.",
        resaltar: () => visible(document.querySelector('[data-juego-vista="misionTree"]')),
      },
      {
        texto: "En el Taller mejorás tus naves.",
        resaltar: () => visible(document.querySelector('[data-juego-vista="taller"]')),
      },
      {
        texto: "En Desarrollo investigás cosas nuevas con tus puntos de ciencia.",
        resaltar: () => visible(document.querySelector('[data-juego-vista="investigacion"]')),
      },
      {
        texto: `Cuando tocás "Pasar Mes", cobrás $${INGRESO_MENSUAL.presupuesto} y ${INGRESO_MENSUAL.ciencia} de ciencia.`,
        expresion: "pensando",
        resaltar: () => visible(document.getElementById("btn-pasar-turno")),
      },
      "Las tarjetas de arriba y abajo son misiones extra. ¡Te ayudan con las principales!",
      "¡A empezar! Tocá la misión del satélite.",
    ],
    objetivo: () =>
      [...panel.querySelectorAll("button, article, li, [role='button']")].find(
        (e) => visible(e) && e.textContent.includes("Lanzamiento de un satélite"),
      ) ?? null,
  });
}
function centrarArbol() {
  const panel = document.querySelector('[data-juego-panel="misionTree"]');
  if (!panel) return;
  requestAnimationFrame(() => {
    const tarjeta = [...panel.querySelectorAll("button, article, li, [role='button']")].find(
      (e) => e.textContent.includes("Lanzamiento de un satélite"),
    );
    tarjeta?.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
  });
}
function bajarAlDetalle() {
  const panel = document.querySelector('[data-juego-panel="misionTree"]');
  if (!panel) return;
  setTimeout(() => {
    const scroll = panel.closest(".juego-main") ?? panel.parentElement;
    scroll?.scrollTo({ top: scroll.scrollHeight, behavior: "smooth" });
  }, 150);
}
export default function configurarJuego({
  vistaInicial = "misionTree",
  categoriaInvestigacionInicial = "propulsion",
  onVolver,
} = {}) {
  const paneles = document.querySelectorAll("[data-juego-panel]");
  const botonesVista = document.querySelectorAll("[data-juego-vista]");
  const presupuesto = document.getElementById("juego-presupuesto");
  const ciencia = document.getElementById("juego-ciencia");
  const ingresoPresupuesto = document.getElementById(
    "juego-ingreso-presupuesto",
  );
  const ingresoCiencia = document.getElementById("juego-ingreso-ciencia");
  const turno = document.getElementById("juego-turno");
  const btnPasarTurno = document.getElementById("btn-pasar-turno");
  const btnToggleSidebar = document.getElementById("btn-toggle-sidebar");
  const btnVolver = document.getElementById("btn-misiones-volver");
  const btnInformacion = document.getElementById("btn-informacion");

  function actualizarHUD(partida = gameState.obtenerSlotActual()) {
    if (!partida) {
      throw new Error(
        "No hay una campaña activa para mostrar el centro de mando.",
      );
    }

    presupuesto.textContent = Number(partida.presupuesto ?? 0).toLocaleString(
      "es-AR",
    );
    ciencia.textContent = Number(partida.ciencia ?? 0).toLocaleString("es-AR");
    ingresoPresupuesto.textContent = INGRESO_MENSUAL.presupuesto.toLocaleString(
      "es-AR",
    );
    ingresoCiencia.textContent = INGRESO_MENSUAL.ciencia.toLocaleString(
      "es-AR",
    );

    turno.textContent = partida.mes ?? 1;
  }

  const actualizarMisionTree = inicializarBase();
  function actualizarEstadoCampana(partida) {
    actualizarHUD(partida);
    actualizarMisionTree();
  }

  const actualizarVistas = {
    misionTree: actualizarMisionTree,
    taller: inicializarTaller({
      onResourcesChanged: actualizarEstadoCampana,
    }),
    investigacion: inicializarInvestigacion({
      onResourcesChanged: actualizarEstadoCampana,
      categoriaInicial: categoriaInvestigacionInicial,
    }),
  };

  function mostrarVista(vista) {
    if (!actualizarVistas[vista]) {
      throw new Error(`La vista de juego "${vista}" no existe.`);
    }

    paneles.forEach((panel) => {
      panel.hidden = panel.dataset.juegoPanel !== vista;
    });

    botonesVista.forEach((boton) => {
      if (boton.dataset.juegoVista === vista) {
        boton.setAttribute("aria-current", "page");
      } else {
        boton.removeAttribute("aria-current");
      }
    });

    actualizarVistas[vista]?.();
    guardarVistaJuego(vista);
       if (vista === "misionTree") {
       centrarArbol();
       lanzarTutorialCentro();
    }
  }
  botonesVista.forEach((boton) => {
    boton.onclick = () => mostrarVista(boton.dataset.juegoVista);
  });

  btnToggleSidebar.onclick = () => {
    const container = document.querySelector(".juego-container");
    const colapsada = container.classList.toggle("sidebar-colapsada");
    btnToggleSidebar.setAttribute("aria-expanded", String(!colapsada));
    btnToggleSidebar.setAttribute(
      "aria-label",
      colapsada ? "Expandir barra lateral" : "Colapsar barra lateral",
    );
  };

  btnPasarTurno.onclick = () => {
    const partida = gameState.obtenerSlotActual();
    if (!partida) {
      throw new Error("No hay una campaña activa para avanzar el turno.");
    }

    const partidaActualizada = gameState.actualizarSlotActual({
      mes: (partida.mes ?? 1) + 1,
      presupuesto: Number(partida.presupuesto ?? 0) + INGRESO_MENSUAL.presupuesto,
      ciencia: Number(partida.ciencia ?? 0) + INGRESO_MENSUAL.ciencia,
    });
    if (!partidaActualizada) {
      throw new Error("No se pudo guardar el avance del turno.");
    }

    actualizarEstadoCampana(partidaActualizada);
    actualizarVistas.taller();
  };

  if (btnVolver && onVolver) {
    btnVolver.onclick = onVolver;
  }

  if (!btnInformacion) {
    throw new Error("No se encontró el botón de información desbloqueada.");
  }
  btnInformacion.onclick = mostrarDialogoInformacion;
   document.querySelector('[data-juego-panel="misionTree"]')
    ?.addEventListener("click", (e) => {
      if (e.target.closest("#nodos-misiones button, #nodos-misiones [role='button'], #nodos-misiones article, #nodos-misiones li")) {
        bajarAlDetalle();
      }
    });
  mostrarVista(vistaInicial);
  actualizarHUD();
}