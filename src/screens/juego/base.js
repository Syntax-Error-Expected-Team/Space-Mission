import gameState from "../../game-state.js";
import { NODOS } from "../mision.js";

export default function inicializarBase() {
  const iconoNodo = document.getElementById("nodo-actual-icon");
  const nombreNodo = document.getElementById("juego-nodo-actual");

  if (!iconoNodo || !nombreNodo) {
    throw new Error("No se encontró el contenido de la vista Base.");
  }

  return function actualizarBase() {
    const partida = gameState.obtenerSlotActual();
    if (!partida) {
      throw new Error("No hay una campaña activa para mostrar la Base.");
    }

    const nodo = NODOS.find(({ id }) => id === partida.nodoActual);
    iconoNodo.textContent = nodo?.icon ?? "public";
    nombreNodo.textContent = nodo?.label ?? "Tierra";
  };
}
