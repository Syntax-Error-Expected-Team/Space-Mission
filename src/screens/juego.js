import gameState, { INGRESO_MENSUAL } from "../game-state.js";
import inicializarBase from "./juego/base.js";
import inicializarTaller from "./juego/taller.js";
import inicializarInvestigacion from "./juego/investigacion.js";
import { guardarVistaJuego } from "../navigation-state.js";

export default function configurarJuego({
  vistaInicial = "base",
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

  const actualizarVistas = {
    base: inicializarBase(),
    taller: inicializarTaller(),
    investigacion: inicializarInvestigacion({
      onResourcesChanged: actualizarHUD,
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

    actualizarHUD(partidaActualizada);
  };

  if (btnVolver && onVolver) {
    btnVolver.onclick = onVolver;
  }

  mostrarVista(vistaInicial);
  actualizarHUD();
}
