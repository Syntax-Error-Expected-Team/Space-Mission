import gameState, { MISION_INICIAL } from "../../game-state.js";

const MISIONES = [
  {
    id: MISION_INICIAL,
    label: "Lanzamiento de un satélite artificial",
    tipo: "principal",
    icon: "satellite_alt",
    position: { x: 9, y: 50 },
    descripcion:
      "Poner en órbita el primer satélite artificial y abrir la era espacial.",
  },
  {
    id: "vuelo_espacial_tripulado",
    label: "Poner un ser humano en órbita",
    tipo: "principal",
    icon: "rocket_launch",
    position: { x: 25, y: 50 },
    descripcion:
      "Enviar a una persona a completar una órbita terrestre y traerla de vuelta de forma segura.",
  },
  {
    id: "misiones_orbitales",
    label: "Misiones tripuladas en órbita",
    tipo: "principal",
    icon: "orbit",
    position: { x: 41, y: 50 },
    descripcion:
      "Ampliar la duración de los vuelos y estudiar cómo se vive en órbita.",
  },
  {
    id: "encuentro_orbital",
    label: "Encuentro y acoplamiento orbital",
    tipo: "principal",
    icon: "join",
    position: { x: 57, y: 50 },
    descripcion:
      "Dominar el encuentro entre naves y las operaciones de acoplamiento.",
  },
  {
    id: "orbita_lunar_tripulada",
    label: "Vuelo tripulado alrededor de la Luna",
    tipo: "principal",
    icon: "dark_mode",
    position: { x: 73, y: 50 },
    descripcion:
      "Completar una misión tripulada alrededor de la Luna antes del descenso.",
  },
  {
    id: "alunizaje_tripulado",
    label: "Alunizaje tripulado",
    tipo: "principal",
    icon: "landscape",
    position: { x: 91, y: 50 },
    descripcion:
      "Llevar una tripulación a la superficie lunar y devolverla a la Tierra.",
  },
  {
    id: "observacion_terrestre",
    label: "Observación de la Tierra",
    tipo: "secundaria",
    icon: "public",
    position: { x: 17, y: 18 },
    descripcion:
      "Usar satélites para observar el clima, los océanos y la superficie terrestre.",
  },
  {
    id: "estacion_espacial",
    label: "Construcción de una estación espacial",
    tipo: "secundaria",
    icon: "adf_scanner",
    position: { x: 41, y: 82 },
    descripcion:
      "Desarrollar una instalación orbital para estadías prolongadas.",
  },
  {
    id: "laboratorio_microgravedad",
    label: "Laboratorio de microgravedad",
    tipo: "secundaria",
    icon: "biotech",
    position: { x: 57, y: 82 },
    descripcion:
      "Realizar experimentos científicos en condiciones de microgravedad.",
  },
  {
    id: "sonda_lunar",
    label: "Sonda robótica lunar",
    tipo: "secundaria",
    icon: "travel_explore",
    position: { x: 60, y: 18 },
    descripcion:
      "Enviar una sonda no tripulada para estudiar el entorno lunar.",
  },
  {
    id: "cartografia_lunar",
    label: "Cartografía de la superficie lunar",
    tipo: "secundaria",
    icon: "map",
    position: { x: 75, y: 14 },
    descripcion:
      "Mapear la superficie y localizar zonas de interés para futuras misiones.",
  },
  {
    id: "seleccion_sitio_alunizaje",
    label: "Selección del sitio de alunizaje",
    tipo: "secundaria",
    icon: "pin_drop",
    position: { x: 87, y: 23 },
    descripcion:
      "Identificar una zona segura para descender y realizar operaciones lunares.",
  },
  {
    id: "rover_lunar",
    label: "Exploración con rover lunar",
    tipo: "secundaria",
    icon: "precision_manufacturing",
    position: { x: 91, y: 82 },
    descripcion:
      "Ampliar la exploración de la superficie lunar con vehículos robóticos.",
  },
];

const CONEXIONES_MISIONES = [
  ["lanzamiento_satelite", "vuelo_espacial_tripulado"],
  ["vuelo_espacial_tripulado", "misiones_orbitales"],
  ["misiones_orbitales", "encuentro_orbital"],
  ["encuentro_orbital", "orbita_lunar_tripulada"],
  ["orbita_lunar_tripulada", "alunizaje_tripulado"],
  ["lanzamiento_satelite", "observacion_terrestre"],
  ["misiones_orbitales", "estacion_espacial"],
  ["estacion_espacial", "laboratorio_microgravedad"],
  ["encuentro_orbital", "sonda_lunar"],
  ["sonda_lunar", "cartografia_lunar"],
  ["cartografia_lunar", "seleccion_sitio_alunizaje"],
  ["seleccion_sitio_alunizaje", "orbita_lunar_tripulada"],
  ["alunizaje_tripulado", "rover_lunar"],
];

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function obtenerPartida() {
  const partida = gameState.obtenerSlotActual();
  if (!partida) {
    throw new Error("No hay una campaña activa para mostrar las misiones.");
  }

  return partida;
}

function renderizarArbol(contenedorNodos, contenedorConexiones) {
  const nodosPorId = new Map(MISIONES.map((mision) => [mision.id, mision]));
  contenedorNodos.replaceChildren();
  contenedorConexiones.replaceChildren();

  CONEXIONES_MISIONES.forEach(([origenId, destinoId]) => {
    const origen = nodosPorId.get(origenId);
    const destino = nodosPorId.get(destinoId);
    if (!origen || !destino) {
      throw new Error(
        `La conexión "${origenId}-${destinoId}" referencia una misión inexistente.`,
      );
    }

    const linea = document.createElementNS(SVG_NAMESPACE, "line");
    linea.setAttribute("x1", origen.position.x);
    linea.setAttribute("y1", origen.position.y);
    linea.setAttribute("x2", destino.position.x);
    linea.setAttribute("y2", destino.position.y);
    linea.classList.add("mision-conexion", `mision-conexion-${origen.tipo}`);
    contenedorConexiones.append(linea);
  });

  MISIONES.forEach((mision) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = `mision-nodo mision-${mision.tipo}`;
    boton.dataset.misionId = mision.id;
    boton.style.left = `${mision.position.x}%`;
    boton.style.top = `${mision.position.y}%`;
    boton.setAttribute("aria-pressed", "false");
    boton.setAttribute("aria-label", `Seleccionar misión: ${mision.label}`);

    const icono = document.createElement("span");
    icono.className = "material-symbols-outlined mision-nodo-icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = mision.icon;

    const tipo = document.createElement("span");
    tipo.className = "mision-nodo-tipo";
    tipo.textContent =
      mision.tipo === "principal" ? "Principal" : "Secundaria";

    const etiqueta = document.createElement("strong");
    etiqueta.className = "mision-nodo-label";
    etiqueta.textContent = mision.label;

    boton.append(icono, tipo, etiqueta);
    contenedorNodos.append(boton);
  });
}

export default function inicializarMisionTree() {
  const contenedorNodos = document.getElementById("nodos-misiones");
  const contenedorConexiones = document.getElementById("conexiones-misiones");
  const tituloActual = document.getElementById("mision-actual-titulo");
  const descripcionActual = document.getElementById(
    "mision-actual-descripcion",
  );
  const mensaje = document.getElementById("mision-actual-mensaje");

  if (
    !contenedorNodos ||
    !contenedorConexiones ||
    !tituloActual ||
    !descripcionActual ||
    !mensaje
  ) {
    throw new Error("No se encontraron los elementos del árbol de misiones.");
  }

  renderizarArbol(contenedorNodos, contenedorConexiones);

  function actualizarMisionActual() {
    const partida = obtenerPartida();
    const misionActual = partida.misionActual ?? MISION_INICIAL;
    const mision = MISIONES.find(({ id }) => id === misionActual);
    if (!mision) {
      throw new Error(`La misión actual "${misionActual}" no existe en el árbol.`);
    }

    tituloActual.textContent = mision.label;
    descripcionActual.textContent = mision.descripcion;
    contenedorNodos
      .querySelectorAll("[data-mision-id]")
      .forEach((boton) => {
        const seleccionada = boton.dataset.misionId === misionActual;
        boton.classList.toggle("mision-nodo-actual", seleccionada);
        boton.setAttribute("aria-pressed", String(seleccionada));
      });
  }

  contenedorNodos.onclick = (evento) => {
    const objetivo = evento.target instanceof Element ? evento.target : null;
    const boton = objetivo?.closest("[data-mision-id]");
    if (!boton || !contenedorNodos.contains(boton)) return;

    const partidaActualizada = gameState.actualizarSlotActual({
      misionActual: boton.dataset.misionId,
    });
    if (!partidaActualizada) {
      throw new Error("No se pudo guardar la misión seleccionada.");
    }

    const mision = MISIONES.find(
      ({ id }) => id === partidaActualizada.misionActual,
    );
    mensaje.textContent = `Misión actual seleccionada: ${mision.label}. La selección no marca la misión como completada.`;
    actualizarMisionActual();
  };

  actualizarMisionActual();
  return actualizarMisionActual;
}
