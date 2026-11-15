import gameState from "../game-state";

/**
 * Inicializa la lógica de la pantalla unificada de selección de slots (campañas).
 * @param {Object} options - Opciones de configuración y callbacks.
 * @param {Function} options.onSeleccionarSlot - Callback al hacer clic en un slot válido (recibe el número de slot `n`).
 * @param {Function} options.onVolver - Callback al hacer clic en el botón Volver.
 */
export default function inicializarSlots({ onSeleccionarSlot, onVolver }) {
  const contenedorSlots = document.querySelectorAll(".campana");
  const tituloCampanas = document.getElementById("titulo-campanas");
  const btnVolver = document.getElementById("btn-campanas-volver");

  // Título fijo para la pantalla unificada
  if (tituloCampanas) {
    tituloCampanas.textContent = "Seleccionar Campaña";
  }

  // Función para pintar/actualizar la interfaz de los slots según localStorage
  function pintarSlots() {
    contenedorSlots.forEach((slotEl) => {
      const n = Number(slotEl.dataset.slot);
      const partida = gameState.cargarSlot(n);
      const btn = slotEl.querySelector(".campana-btn");
      const estado = slotEl.querySelector(".campana-estado");
      const borrar = slotEl.querySelector(".btn-borrar");

      // Mostrar u ocultar el botón de borrar según si hay partida guardada
      if (borrar) {
        borrar.hidden = !partida;
      }

      // Actualizar texto y estado visual del botón del slot
      if (partida) {
        estado.textContent = `Mes ${partida.mes || 1} - Presupuesto: $${partida.presupuesto ?? 1000}`;
        btn.disabled = false; // Siempre se puede jugar (continuar) si está ocupado
      } else {
        estado.textContent = "Vacía (Haz clic para crear)";
        btn.disabled = false; // Se puede hacer clic para iniciar una nueva partida aquí
      }
    });
  }

  // Pintar por primera vez al abrir la pantalla
  pintarSlots();

  // Asignar eventos a cada slot y a su botón de borrar
  contenedorSlots.forEach((slotEl) => {
    const n = Number(slotEl.dataset.slot);
    const btn = slotEl.querySelector(".campana-btn");
    const borrar = slotEl.querySelector(".btn-borrar");

    // Clic en el slot (crea si está vacío, o selecciona el actual si ya tiene datos)
    btn.onclick = () => {
      const partidaExistente = gameState.cargarSlot(n);

      if (!partidaExistente) {
        // Si está vacío, creamos una nueva partida en este slot
        console.log(`Creando nueva campaña en el slot ${n}`);
        gameState.crearSlot(n);
      } else {
        // Si ya existe, simplemente establecemos este slot como el activo actual
        console.log(`Continuando campaña en el slot ${n}`);
        gameState.guardarUltimoSlot(n);
      }

      // Notificar al main.js para avanzar al mapa de misiones
      if (onSeleccionarSlot) {
        onSeleccionarSlot(n);
      }
    };

    // Clic en el botón de borrar partida
    if (borrar) {
      borrar.onclick = (e) => {
        e.stopPropagation();
        const ok = confirm(`¿Borrar la Campaña ${n}? No se puede deshacer.`);
        if (!ok) return;

        gameState.borrarSlot(n);
        pintarSlots();
      };
    }
  });

  // Botón volver al menú principal
  if (btnVolver) {
    btnVolver.onclick = () => {
      if (onVolver) onVolver();
    };
  }
}
