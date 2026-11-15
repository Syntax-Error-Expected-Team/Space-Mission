import gameState from "./game-state.js";
import { jugarMinijuego } from "./minijuego.js"

export const TAREAS = {
  lanzamiento_satelite: [
    "Diseñar el satélite",
    "Construir el cohete",
    "Preparar la plataforma de lanzamiento",
  ],
  vuelo_espacial_tripulado: [
    "Seleccionar y entrenar al astronauta",
    "Desarrollar la cápsula",
    "Probar el sistema de rescate",
  ],
  misiones_orbitales: [
    "Ampliar el soporte vital",
    "Planificar vuelos más largos",
    "Estudiar los efectos de vivir en órbita",
  ],
  encuentro_orbital: [
    "Desarrollar el sistema de acoplamiento",
    "Practicar maniobras de aproximación",
    "Probar el encuentro entre dos naves",
  ],
  orbita_lunar_tripulada: [
    "Construir el cohete de gran potencia",
    "Calcular la trayectoria a la Luna",
    "Realizar el vuelo alrededor de la Luna",
  ],
  alunizaje_tripulado: [
    "Desarrollar el módulo de descenso",
    "Entrenar a la tripulación",
    "Descender y regresar a la Tierra",
  ],
  observacion_terrestre: [
    "Construir el satélite de observación",
    "Calibrar los instrumentos",
    "Analizar los datos recibidos",
  ],
  estacion_espacial: [
    "Diseñar los módulos",
    "Lanzar y ensamblar en órbita",
    "Preparar la vida a bordo",
  ],
  laboratorio_microgravedad: [
    "Equipar el laboratorio",
    "Diseñar los experimentos",
    "Analizar los resultados",
  ],
  sonda_lunar: [
    "Construir la sonda",
    "Lanzar hacia la Luna",
    "Recibir los datos lunares",
  ],
  cartografia_lunar: [
    "Fotografiar la superficie",
    "Procesar las imágenes",
    "Marcar zonas de interés",
  ],
  seleccion_sitio_alunizaje: [
    "Evaluar candidatos de aterrizaje",
    "Analizar la seguridad del terreno",
    "Elegir el sitio final",
  ],
  rover_lunar: [
    "Diseñar el rover",
    "Probar la movilidad",
    "Operar el rover en la Luna",
  ],
};

const GASTAR_RECURSOS_REALES = true;

const REINICIAR_PROGRESO_AL_FALLAR = false;

function estaCompleta(partida, misionId, indice) {
  const valor = partida.tareas?.[misionId]?.[indice];
  return valor === true || valor >= 100;
}

export function resumenTareas(misionId, partida) {
  const lista = TAREAS[misionId] ?? [];
  const hechas = lista.filter((_, i) => estaCompleta(partida, misionId, i)).length;
  const porcentaje = lista.length ? Math.round((hechas / lista.length) * 100) : 0;
  return { hechas, total: lista.length, porcentaje };
}

function aplicarResultado(misionId, indice, resultado) {
  const partida = gameState.obtenerSlotActual();
  if (!partida) return null;

  const cambios = {};
  if (GASTAR_RECURSOS_REALES) {
    cambios.presupuesto = resultado.presupuesto;
    cambios.ciencia = resultado.ciencia;
  }

  const tareas = { ...(partida.tareas ?? {}) };
  let misionCompletada = false;

  if (resultado.gano) {
    tareas[misionId] = { ...(tareas[misionId] ?? {}), [indice]: true };
    cambios.tareas = tareas;

    const { hechas, total } = resumenTareas(misionId, { tareas });
    const completados = partida.completados ?? [];
    if (total > 0 && hechas === total && !completados.includes(misionId)) {
      cambios.completados = [...completados, misionId];
      misionCompletada = true;
    }
  } else if (REINICIAR_PROGRESO_AL_FALLAR) {
    tareas[misionId] = {};
    cambios.tareas = tareas;
  }

  return { partida: gameState.actualizarSlotActual(cambios), misionCompletada };
}

function el(tag, clase, texto) {
  const nodo = document.createElement(tag);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function icono(nombre) {
  const nodo = el("span", "material-symbols-outlined", nombre);
  nodo.setAttribute("aria-hidden", "true");
  return nodo;
}

function obtenerDialogo() {
  let dialogo = document.getElementById("modal-tareas");
  if (dialogo) return dialogo;

  dialogo = document.createElement("dialog");
  dialogo.id = "modal-tareas";
  dialogo.innerHTML = `
    <header class="tareas-cabecera">
      <h2 class="tareas-titulo"></h2>
      <button type="button" class="tareas-cerrar" aria-label="Cerrar">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </header>
    <p class="tareas-descripcion"></p>
    <div class="tareas-progreso">
      <div class="tareas-progreso-texto"></div>
      <div class="tareas-segmentos"></div>
    </div>
    <ul class="tareas-lista"></ul>
    <footer class="tareas-pie"></footer>
  `;
  document.body.append(dialogo);
  return dialogo;
}

export function abrirTareas({ misionId, titulo, descripcion, onCambio }) {
  let partida = gameState.obtenerSlotActual();
  if (!partida) return;

  const dialogo = obtenerDialogo();
  dialogo.querySelector(".tareas-titulo").textContent = titulo;
  dialogo.querySelector(".tareas-descripcion").textContent = descripcion;
  dialogo.querySelector(".tareas-cerrar").onclick = () => dialogo.close();
  // Click en el fondo oscuro también cierra
  dialogo.onclick = (e) => {
    if (e.target === dialogo) dialogo.close();
  };

  const pintar = () => pintarContenido(dialogo, misionId, partida, jugarTarea);

  async function jugarTarea(indice) {
    const actual = gameState.obtenerSlotActual() ?? partida;
    const resultado = await jugarMinijuego({
      titulo: TAREAS[misionId][indice],
      presupuesto: actual.presupuesto ?? 0,
      ciencia: actual.ciencia ?? 0,
    });

    const aplicado = aplicarResultado(misionId, indice, resultado);
    if (aplicado) {
      partida = aplicado.partida;
   
      onCambio?.(aplicado.misionCompletada, !resultado.gano);
    }
    pintar();
  }

  pintar();
  dialogo.showModal();
}

function pintarContenido(dialogo, misionId, partida, alElegir) {
  const tareas = TAREAS[misionId] ?? [];
  const { hechas, total, porcentaje } = resumenTareas(misionId, partida);
  const todas = total > 0 && hechas === total;

  dialogo.querySelector(".tareas-progreso-texto").textContent =
    `Progreso de la misión: ${hechas}/${total} tareas (${porcentaje}%)`;
  dialogo.querySelector(".tareas-segmentos").replaceChildren(
    ...tareas.map((_, i) =>
      el(
        "span",
        estaCompleta(partida, misionId, i)
          ? "tareas-segmento llena"
          : "tareas-segmento",
      ),
    ),
  );

  const lista = dialogo.querySelector(".tareas-lista");
  lista.replaceChildren();

  if (tareas.length === 0) {
    lista.append(el("li", "tarea-vacia", "Esta misión todavía no tiene tareas."));
  }

  tareas.forEach((nombre, indice) => {
    const completa = estaCompleta(partida, misionId, indice);

    const boton = el("button", completa ? "tarea completada" : "tarea");
    boton.type = "button";
    boton.disabled = completa;

    const estado = el("span", "tarea-estado");
    if (completa) {
      estado.append("Completada");
    } else {
      estado.append(icono("play_arrow"), "Iniciar");
    }

    boton.append(
      icono(completa ? "check_circle" : "radio_button_unchecked"),
      el("span", "tarea-nombre", nombre),
      estado,
    );
    boton.onclick = () => alElegir(indice);

    const item = el("li");
    item.append(boton);
    lista.append(item);
  });

  const pie = dialogo.querySelector(".tareas-pie");
  pie.replaceChildren();
  if (todas) {
    pie.append(icono("task_alt"), "Misión completada");
  } else {
    pie.append("Hacé click en una tarea para jugar su minijuego");
  }
  pie.classList.toggle("completa", todas);
}