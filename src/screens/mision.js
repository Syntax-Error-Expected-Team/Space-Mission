import gameState from "../game-state";

/**
 * Inicializa la lógica de la pantalla de selección de misiones / nodos estelares.
 * @param {Object} options - Configuración y callbacks.
 * @param {Function} options.onIniciarMision - Callback al seleccionar un nodo válido para jugar (recibe el id del nodo).
 * @param {Function} options.onVolver - Callback al hacer clic en el botón volver.
 */
export default function inicializarMision({ onIniciarMision, onVolver }) {
  const btnVolver = document.getElementById("btn-mision-volver");
  const nodosEstelares = document.querySelectorAll(".nodo-estelar");

  // Elementos del HUD para mostrar recursos actualizados en tiempo real
  const hudPresupuesto = document.getElementById("hud-presupuesto");
  const hudCiencia = document.getElementById("hud-ciencia");

  // Actualizar HUD con los datos de la partida actual
  function actualizarHUD() {
    const partida = gameState.obtenerSlotActual();
    if (partida) {
      if (hudPresupuesto)
        hudPresupuesto.textContent = partida.presupuesto ?? 1000;
      if (hudCiencia) hudCiencia.textContent = partida.ciencia ?? 0;
    }
  }

  // Refrescar estado visual de los nodos según el progreso guardado
  function actualizarNodosVisuales() {
    const partida = gameState.obtenerSlotActual();
    if (!partida) return;

    const desbloqueados = partida.desbloqueados || ["tierra"];
    const nodoActual = partida.nodoActual || "tierra";

    nodosEstelares.forEach((nodoEl) => {
      const idNodo = nodoEl.dataset.nodo;

      // Limpiar clases previas de estado
      nodoEl.classList.remove("desbloqueado", "disponible", "bloqueado");

      if (idNodo === nodoActual) {
        nodoEl.classList.add("desbloqueado");
        nodoEl.title = "Nodo actual";
      } else if (desbloqueados.includes(idNodo)) {
        nodoEl.classList.add("disponible");
        nodoEl.title = "Nodo disponible para explorar";
      } else {
        nodoEl.classList.add("bloqueado");
        nodoEl.title = "Nodo bloqueado";
      }
    });
  }

  // Inicializar vista al abrir la pantalla
  actualizarHUD();
  actualizarNodosVisuales();

  // Asignar eventos de clic a cada nodo
  nodosEstelares.forEach((nodoEl) => {
    nodoEl.onclick = () => {
      const idNodo = nodoEl.dataset.nodo;
      const partida = gameState.obtenerSlotActual();
      const desbloqueados = partida?.desbloqueados || ["tierra"];

      // Verificar si el nodo está bloqueado
      if (!desbloqueados.includes(idNodo) && idNodo !== partida?.nodoActual) {
        alert(
          "Este nodo estelar aún está bloqueado. Completa misiones anteriores para avanzar.",
        );
        return;
      }

      console.log(`Seleccionado nodo de misión: ${idNodo}`);

      // Actualizar el nodo actual en el estado del juego
      gameState.actualizarSlotActual({ nodoActual: idNodo });

      // Ejecutar callback para pasar a la pantalla de juego
      if (onIniciarMision) {
        onIniciarMision(idNodo);
      }
    };
  });

  // Botón Volver
  if (btnVolver) {
    btnVolver.onclick = () => {
      if (onVolver) onVolver();
    };
  }
}
