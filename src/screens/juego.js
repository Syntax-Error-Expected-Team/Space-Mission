import gameState from "../game-state.js";
import { NODOS } from "./mision.js";

export default function configurarJuego() {
  const paneles = document.querySelectorAll("[data-juego-panel]");
  const botonesVista = document.querySelectorAll("[data-juego-vista]");
  const presupuesto = document.getElementById("juego-presupuesto");
  const ciencia = document.getElementById("juego-ciencia");
  const nodoIcon = document.getElementById("nodo-actual-icon");
  const nodoActual = document.getElementById("juego-nodo-actual");
  const turno = document.getElementById("juego-turno");
  const btnPasarTurno = document.getElementById("btn-pasar-turno");
  const btnToggleSidebar = document.getElementById("btn-toggle-sidebar");

  function mostrarVista(vista) {
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
  }

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

    nodoIcon.textContent = NODOS.find((n) => n.id === partida.nodoActual)?.icon ?? "public";
    nodoActual.textContent = NODOS.find((n) => n.id === partida.nodoActual)?.label ?? "Tierra";
    turno.textContent = partida.mes ?? 1;
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
    });
    if (!partidaActualizada) {
      throw new Error("No se pudo guardar el avance del turno.");
    }

    actualizarHUD(partidaActualizada);
  };

  mostrarVista("base");
  actualizarHUD();
}
