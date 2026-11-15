import gameState, { MISION_INICIAL } from "../../game-state.js";

const CONDICIONES_BASE_COHETE = [
  ["punta", "Punta"],
  ["tanque", "Tanque"],
  ["motor", "Motor"],
].map(([ranura, etiqueta]) => ({
  tipo: "componente",
  ranura,
  etiqueta: `Instalar: ${etiqueta}.`,
}));

function condicionInvestigacion(id, etiqueta) {
  return {
    tipo: "investigacion",
    id,
    etiqueta: `Investigación completada: ${etiqueta}.`,
  };
}

function condicionComponente(ranura, id, etiqueta) {
  return {
    tipo: "componente",
    ranura,
    opciones: [id],
    etiqueta: `Instalar: ${etiqueta}.`,
  };
}

export const MISIONES = [
  {
    id: MISION_INICIAL,
    label: "Lanzamiento de un satélite artificial",
    tipo: "principal",
    icon: "satellite_alt",
    position: { x: 9, y: 50 },
    duracionMeses: 5,
    recompensa: { presupuesto: 500, ciencia: 30 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "carga_satelite", "Satélite artificial"),
      condicionInvestigacion("satelites_comunicacion", "Satélites de comunicación"),
    ],
    descripcion:
      "Poner en órbita el primer satélite artificial y abrir la era espacial.",
  },
  {
    id: "vuelo_espacial_tripulado",
    label: "Poner un ser humano en órbita",
    tipo: "principal",
    icon: "rocket_launch",
    position: { x: 25, y: 50 },
    duracionMeses: 4,
    recompensa: { presupuesto: 750, ciencia: 45 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "capsula_tripulada", "Cápsula tripulada"),
      condicionInvestigacion("motores_liq", "Motores de combustión líquida"),
      condicionInvestigacion("sistema_telemetria", "Sistema de telemetría"),
    ],
    descripcion:
      "Enviar a una persona a completar una órbita terrestre y traerla de vuelta de forma segura.",
  },
  {
    id: "misiones_orbitales",
    label: "Misiones tripuladas en órbita",
    tipo: "principal",
    icon: "orbit",
    position: { x: 41, y: 50 },
    duracionMeses: 6,
    recompensa: { presupuesto: 900, ciencia: 55 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "modulo_estacion", "Módulo orbital"),
      condicionInvestigacion("proteccion_radiacion", "Protección contra radiación"),
      condicionInvestigacion("estructura_modular", "Estructura modular"),
    ],
    descripcion:
      "Ampliar la duración de los vuelos y estudiar cómo se vive en órbita.",
  },
  {
    id: "encuentro_orbital",
    label: "Encuentro y acoplamiento orbital",
    tipo: "principal",
    icon: "join",
    position: { x: 57, y: 50 },
    duracionMeses: 4,
    recompensa: { presupuesto: 1000, ciencia: 60 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "modulo_acoplamiento", "Módulo de acoplamiento"),
      condicionInvestigacion("navegacion_autonoma", "Navegación autónoma"),
      condicionInvestigacion("sistema_telemetria", "Sistema de telemetría"),
    ],
    descripcion:
      "Dominar el encuentro entre naves y las operaciones de acoplamiento.",
  },
  {
    id: "orbita_lunar_tripulada",
    label: "Vuelo tripulado alrededor de la Luna",
    tipo: "principal",
    icon: "dark_mode",
    position: { x: 73, y: 50 },
    duracionMeses: 6,
    recompensa: { presupuesto: 1300, ciencia: 80 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "modulo_lunar", "Módulo de vuelo lunar"),
      condicionInvestigacion("tanques_criogenicos", "Tanques criogénicos"),
      condicionInvestigacion("navegacion_autonoma", "Navegación autónoma"),
    ],
    descripcion:
      "Completar una misión tripulada alrededor de la Luna antes del descenso.",
  },
  {
    id: "alunizaje_tripulado",
    label: "Alunizaje tripulado",
    tipo: "principal",
    icon: "landscape",
    position: { x: 91, y: 50 },
    duracionMeses: 5,
    recompensa: { presupuesto: 1800, ciencia: 120 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "modulo_alunizaje", "Módulo de alunizaje"),
      condicionInvestigacion("habitat_presurizado", "Hábitat presurizado"),
      condicionInvestigacion("rovers_exploracion", "Rovers de exploración"),
    ],
    descripcion:
      "Llevar una tripulación a la superficie lunar y devolverla a la Tierra.",
  },
  {
    id: "observacion_terrestre",
    label: "Observación de la Tierra",
    tipo: "secundaria",
    icon: "public",
    position: { x: 17, y: 18 },
    duracionMeses: 3,
    recompensa: { presupuesto: 400, ciencia: 25 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "carga_observacion", "Carga de observación terrestre"),
      condicionInvestigacion("satelites_comunicacion", "Satélites de comunicación"),
    ],
    descripcion:
      "Usar satélites para observar el clima, los océanos y la superficie terrestre.",
  },
  {
    id: "estacion_espacial",
    label: "Construcción de una estación espacial",
    tipo: "secundaria",
    icon: "adf_scanner",
    position: { x: 41, y: 82 },
    duracionMeses: 6,
    recompensa: { presupuesto: 1100, ciencia: 70 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "modulo_estacion", "Módulo de estación espacial"),
      condicionInvestigacion("estructura_modular", "Estructura modular"),
      condicionInvestigacion("habitat_presurizado", "Hábitat presurizado"),
    ],
    descripcion:
      "Desarrollar una instalación orbital para estadías prolongadas.",
  },
  {
    id: "laboratorio_microgravedad",
    label: "Laboratorio de microgravedad",
    tipo: "secundaria",
    icon: "biotech",
    position: { x: 57, y: 82 },
    duracionMeses: 4,
    recompensa: { presupuesto: 700, ciencia: 50 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "modulo_laboratorio", "Laboratorio de microgravedad"),
      condicionInvestigacion("plataforma_cientifica", "Plataforma científica integrada"),
    ],
    descripcion:
      "Realizar experimentos científicos en condiciones de microgravedad.",
  },
  {
    id: "sonda_lunar",
    label: "Sonda robótica lunar",
    tipo: "secundaria",
    icon: "travel_explore",
    position: { x: 60, y: 18 },
    duracionMeses: 4,
    recompensa: { presupuesto: 650, ciencia: 40 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "carga_sonda_lunar", "Sonda lunar"),
      condicionInvestigacion("instrumentos_roboticos", "Instrumentos robóticos"),
      condicionInvestigacion("navegacion_autonoma", "Navegación autónoma"),
    ],
    descripcion:
      "Enviar una sonda no tripulada para estudiar el entorno lunar.",
  },
  {
    id: "cartografia_lunar",
    label: "Cartografía de la superficie lunar",
    tipo: "secundaria",
    icon: "map",
    position: { x: 75, y: 14 },
    duracionMeses: 3,
    recompensa: { presupuesto: 500, ciencia: 35 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "carga_cartografia", "Instrumento de cartografía lunar"),
      condicionInvestigacion("telescopios_espaciales", "Telescopios espaciales"),
    ],
    descripcion:
      "Mapear la superficie y localizar zonas de interés para futuras misiones.",
  },
  {
    id: "seleccion_sitio_alunizaje",
    label: "Selección del sitio de alunizaje",
    tipo: "secundaria",
    icon: "pin_drop",
    position: { x: 87, y: 23 },
    duracionMeses: 3,
    recompensa: { presupuesto: 550, ciencia: 35 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "carga_sensores_lunares", "Sensores de prospección lunar"),
      condicionInvestigacion("navegacion_autonoma", "Navegación autónoma"),
    ],
    descripcion:
      "Identificar una zona segura para descender y realizar operaciones lunares.",
  },
  {
    id: "rover_lunar",
    label: "Exploración con rover lunar",
    tipo: "secundaria",
    icon: "precision_manufacturing",
    position: { x: 91, y: 82 },
    duracionMeses: 5,
    recompensa: { presupuesto: 850, ciencia: 55 },
    condicionesVictoria: [
      ...CONDICIONES_BASE_COHETE,
      condicionComponente("carga_util", "carga_rover", "Rover lunar"),
      condicionInvestigacion("rovers_exploracion", "Rovers de exploración"),
      condicionInvestigacion("instrumentos_roboticos", "Instrumentos robóticos"),
    ],
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

function obtenerMisionesCompletadas(partida) {
  return new Set(
    Array.isArray(partida.misionesCompletadas)
      ? partida.misionesCompletadas
      : [],
  );
}

function obtenerPredecesoras(misionId) {
  return CONEXIONES_MISIONES.filter(
    ([, destinoId]) => destinoId === misionId,
  ).map(([origenId]) => origenId);
}

export function obtenerCondicionesVictoria(mision, partida) {
  const partesInstaladas = partida.taller?.partesInstaladas;
  const investigaciones = new Set(
    Array.isArray(partida.investigacionesCompletadas)
      ? partida.investigacionesCompletadas
      : [],
  );

  return mision.condicionesVictoria.map((condicion) => {
    if (condicion.tipo === "componente") {
      const parte = Array.isArray(partesInstaladas)
        ? partesInstaladas.find(
            (id) => id === condicion.ranura || condicion.opciones?.includes(id),
          )
        : partesInstaladas?.[condicion.ranura];
      return {
        ...condicion,
        cumplida:
          Boolean(parte) &&
          (!condicion.opciones || condicion.opciones.includes(parte)),
      };
    }

    if (condicion.tipo === "investigacion") {
      return {
        ...condicion,
        cumplida: investigaciones.has(condicion.id),
      };
    }

    throw new Error(
      `La condición "${condicion.tipo}" de la misión "${mision.id}" no es válida.`,
    );
  });
}

function renderizarListaCondiciones(contenedor, condiciones) {
  contenedor.replaceChildren(
    ...condiciones.map((condicion) => {
      const elemento = document.createElement("li");
      elemento.classList.toggle(
        "mision-condicion-cumplida",
        condicion.cumplida,
      );

      const estado = document.createElement("span");
      estado.className = "material-symbols-outlined";
      estado.setAttribute("aria-hidden", "true");
      estado.textContent = condicion.cumplida
        ? "check_circle"
        : "radio_button_unchecked";

      const etiqueta = document.createElement("span");
      etiqueta.textContent = condicion.etiqueta;

      elemento.append(estado, etiqueta);
      return elemento;
    }),
  );
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
    tipo.textContent = mision.tipo === "principal" ? "Principal" : "Secundaria";

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
  const tipoActual = document.getElementById("mision-tipo");
  const mensaje = document.getElementById("mision-actual-mensaje");
  const duracion = document.getElementById("mision-duracion");
  const recompensa = document.getElementById("mision-recompensa");
  const listaPrerequisitos = document.getElementById("mision-prerequisitos");
  const listaCondiciones = document.getElementById("mision-condiciones");
  const btnConfirmar = document.getElementById("btn-confirmar-mision");

  if (
    !contenedorNodos ||
    !contenedorConexiones ||
    !tituloActual ||
    !descripcionActual ||
    !tipoActual ||
    !mensaje ||
    !duracion ||
    !recompensa ||
    !listaPrerequisitos ||
    !listaCondiciones ||
    !btnConfirmar
  ) {
    throw new Error("No se encontraron los elementos del árbol de misiones.");
  }

  renderizarArbol(contenedorNodos, contenedorConexiones);

  function actualizarMisionActual() {
    const partida = obtenerPartida();
    const misionActual = partida.misionActual ?? MISION_INICIAL;
    const mision = MISIONES.find(({ id }) => id === misionActual);
    if (!mision) {
      throw new Error(
        `La misión actual "${misionActual}" no existe en el árbol.`,
      );
    }

    tituloActual.textContent = mision.label;
    tipoActual.textContent =
      mision.tipo === "principal" ? "Misión principal" : "Misión secundaria";
    descripcionActual.textContent = mision.descripcion;
    duracion.textContent = `Duración estimada: ${mision.duracionMeses} meses.`;
    recompensa.textContent =
      `Recompensa por éxito: $${mision.recompensa.presupuesto.toLocaleString("es-AR")} y ${mision.recompensa.ciencia.toLocaleString("es-AR")} puntos de investigación.`;
    const completadas = obtenerMisionesCompletadas(partida);
    const enCurso = partida.misionEnCurso;
    const predecesoras = obtenerPredecesoras(mision.id);
    const faltanPredecesoras = predecesoras.filter(
      (id) => !completadas.has(id),
    );
    const condiciones = obtenerCondicionesVictoria(mision, partida);
    const misionCompletada = completadas.has(mision.id);

    renderizarListaCondiciones(
      listaPrerequisitos,
      predecesoras.length
        ? predecesoras.map((id) => {
            const anterior = MISIONES.find((item) => item.id === id);
            return {
              etiqueta: anterior.label,
              cumplida: completadas.has(id),
            };
          })
        : [{ etiqueta: "Ninguno: es la misión inicial.", cumplida: true }],
    );
    renderizarListaCondiciones(listaCondiciones, condiciones);

    contenedorNodos.querySelectorAll("[data-mision-id]").forEach((boton) => {
      const seleccionada = boton.dataset.misionId === misionActual;
      const completada = completadas.has(boton.dataset.misionId);
      const requisitos = obtenerPredecesoras(boton.dataset.misionId);
      const desbloqueada = requisitos.every((id) => completadas.has(id));
      const esActiva = enCurso?.id === boton.dataset.misionId;

      boton.classList.toggle("mision-nodo-actual", seleccionada);
      boton.classList.toggle(
        "mision-nodo-completada",
        completada,
      );
      boton.classList.toggle(
        "mision-nodo-bloqueado",
        !completada && !desbloqueada,
      );
      boton.classList.toggle(
        "mision-nodo-disponible",
        !completada && desbloqueada,
      );
      boton.classList.toggle("mision-nodo-en-curso", esActiva);
      boton.setAttribute("aria-pressed", String(seleccionada));
      boton.title = completada
        ? "Misión completada"
        : esActiva
          ? "Misión en curso"
          : desbloqueada
            ? "Misión disponible para iniciar"
            : "Misión bloqueada por prerequisitos pendientes";
    });

    if (misionCompletada) {
      mensaje.textContent = "Misión completada.";
    } else if (enCurso) {
      const misionEnCurso = MISIONES.find(({ id }) => id === enCurso.id);
      if (!misionEnCurso) {
        throw new Error(`La misión en curso "${enCurso.id}" no existe.`);
      }
      const mesesTranscurridos = Math.max(
        0,
        Number(partida.mes ?? 1) - Number(enCurso.mesInicio),
      );
      if (enCurso.id === mision.id) {
        mensaje.textContent = `En curso: ${mesesTranscurridos} meses transcurridos. La duración estimada es ${mision.duracionMeses} meses; prepara el cohete y lánzalo desde el Taller cuando cumplas las condiciones.`;
      } else {
        mensaje.textContent =
          `La misión "${misionEnCurso.label}" está en curso (${mesesTranscurridos} meses transcurridos).`;
      }
    } else if (faltanPredecesoras.length > 0) {
      mensaje.textContent =
        "Completa todas las misiones prerequisito antes de iniciar esta misión.";
    } else {
      mensaje.textContent =
        "Lista para iniciar. Las condiciones del cohete se completan después, desde el Taller.";
    }

    btnConfirmar.disabled =
      misionCompletada || Boolean(enCurso) || faltanPredecesoras.length > 0;
    btnConfirmar.textContent = misionCompletada
      ? "Misión completada"
      : enCurso
        ? enCurso.id === mision.id
          ? "Misión en curso"
          : "Otra misión está en curso"
        : faltanPredecesoras.length > 0
          ? "Completa las misiones prerequisito"
          : "Confirmar e iniciar misión";
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
    actualizarMisionActual();
  };

  btnConfirmar.onclick = () => {
    const partida = obtenerPartida();
    const mision = MISIONES.find(
      ({ id }) => id === (partida.misionActual ?? MISION_INICIAL),
    );
    if (!mision) {
      throw new Error("No se encontró la misión seleccionada.");
    }

    if (partida.misionEnCurso) {
      actualizarMisionActual();
      return;
    }
    if (obtenerMisionesCompletadas(partida).has(mision.id)) {
      actualizarMisionActual();
      return;
    }

    const faltanPredecesoras = obtenerPredecesoras(mision.id).filter(
      (id) => !obtenerMisionesCompletadas(partida).has(id),
    );
    if (faltanPredecesoras.length > 0) {
      actualizarMisionActual();
      return;
    }

    const partidaActualizada = gameState.actualizarSlotActual({
      misionEnCurso: {
        id: mision.id,
        mesInicio: Number(partida.mes ?? 1),
      },
    });
    if (!partidaActualizada) {
      throw new Error(`No se pudo iniciar la misión "${mision.label}".`);
    }
    actualizarMisionActual();
  };

  actualizarMisionActual();
  return actualizarMisionActual;
}
