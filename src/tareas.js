import gameState from "./game-state.js";

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

const MODO_PRUEBA = true;
const PASO_PRUEBA = 25;

let anterior = {};

function progresoDe(partida, misionId, indice) {
  return partida.tareas?.[misionId]?.[indice] ?? 0;
}

export function resumenTareas(misionId, partida) {
  const lista = TAREAS[misionId] ?? [];
  const hechas = lista.filter(
    (_, i) => progresoDe(partida, misionId, i) >= 100,
  ).length;
  return { hechas, total: lista.length };
}

export function sumarProgreso(misionId, indice, cantidad) {
  const partida = gameState.obtenerSlotActual();
  if (!partida) return null;

  const tareas = { ...(partida.tareas ?? {}) };
  const deLaMision = { ...(tareas[misionId] ?? {}) };
  deLaMision[indice] = Math.min(100, (deLaMision[indice] ?? 0) + cantidad);
  tareas[misionId] = deLaMision;

  const cambios = { tareas };
  const completados = partida.completados ?? [];
  const { hechas, total } = resumenTareas(misionId, { tareas });
  let misionCompletada = false;

  if (total > 0 && hechas === total && !completados.includes(misionId)) {
    cambios.completados = [...completados, misionId];
    misionCompletada = true;
  }

  return {
    partida: gameState.actualizarSlotActual(cambios),
    misionCompletada,
  };
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
  anterior = {};

  dialogo.querySelector(".tareas-titulo").textContent = titulo;
  dialogo.querySelector(".tareas-descripcion").textContent = descripcion;
  dialogo.querySelector(".tareas-cerrar").onclick = () => dialogo.close();
  dialogo.onclick = (e) => {
    if (e.target === dialogo) dialogo.close();
  };

  const pintar = () =>
    pintarLista(dialogo, misionId, partida, (indice) => {
      const resultado = sumarProgreso(misionId, indice, PASO_PRUEBA);
      if (!resultado) return;
      partida = resultado.partida;
      onCambio?.(resultado.misionCompletada);
      pintar();
    });

  pintar();
  dialogo.showModal();
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

function pintarLista(dialogo, misionId, partida, alProbar) {
  const lista = dialogo.querySelector(".tareas-lista");
  lista.replaceChildren();

  const tareas = TAREAS[misionId] ?? [];
  if (tareas.length === 0) {
    lista.append(el("li", "tarea", "Esta misión todavía no tiene tareas."));
  }

  tareas.forEach((nombre, indice) => {
    const progreso = progresoDe(partida, misionId, indice);
    const completa = progreso >= 100;

    const item = el("li", completa ? "tarea completada" : "tarea");

    const estado = el("span", "tarea-estado");
    if (completa) {
      estado.append(icono("check_circle"), "Completada");
    } else {
      estado.append(progreso > 0 ? "En progreso" : "Pendiente");
    }
    const fila1 = el("div", "tarea-fila");
    fila1.append(el("span", "tarea-nombre", nombre), estado);

    const barra = el("div", "tarea-barra");
    const relleno = el("div", "tarea-barra-relleno");
    relleno.style.width = `${anterior[indice] ?? 0}%`;
    barra.append(relleno);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        relleno.style.width = `${progreso}%`;
      }),
    );
    anterior[indice] = progreso;

    const fila2 = el("div", "tarea-fila");
    fila2.append(el("span", "tarea-porcentaje", `${progreso}%`));
    if (MODO_PRUEBA && !completa) {
      const boton = el("button", "tarea-probar", `+${PASO_PRUEBA}% (prueba)`);
      boton.type = "button";
      boton.onclick = () => alProbar(indice);
      fila2.append(boton);
    }

    item.append(fila1, barra, fila2);
    lista.append(item);
  });

  const { hechas, total } = resumenTareas(misionId, partida);
  const todas = total > 0 && hechas === total;
  const pie = dialogo.querySelector(".tareas-pie");
  pie.replaceChildren();
  if (todas) {
    pie.append(icono("task_alt"), "Todas las tareas completadas");
  } else {
    pie.append(`Tareas completadas: ${hechas}/${total}`);
  }
  pie.classList.toggle("completa", todas);
}