import gameState from "../../game-state.js";
import { tutorialCuandoSeVea } from "../../robot.js";
import abrirDialogoDinamico from "../dialog.js";
import { MISIONES, obtenerCondicionesVictoria } from "./misionTree.js";
import { ARBOLES_INVESTIGACION } from "./investigacion.js";

const RANURAS = [
  { id: "punta", nombre: "Punta", icono: "change_history" },
  { id: "cabina", nombre: "Cabina", icono: "airline_seat_recline_extra" },
  { id: "tanque", nombre: "Tanque", icono: "propane_tank" },
  { id: "alas", nombre: "Estabilizadores", icono: "flight" },
  { id: "motor", nombre: "Motor", icono: "rocket_launch" },
  { id: "carga_util", nombre: "Carga útil", icono: "satellite_alt" },
];

const COMPONENTES = [
  {
    id: "punta_estandar",
    ranura: "punta",
    nombre: "Punta estándar",
    precio: 100,
    masa: 50,
    fiabilidad: 72,
    material: "Aleación de aluminio",
    descripcion: "Diseño ligero para vuelos orbitales básicos.",
  },
  {
    id: "punta_reforzada",
    ranura: "punta",
    nombre: "Punta reforzada",
    precio: 180,
    masa: 82,
    fiabilidad: 90,
    investigacionRequerida: "aleaciones_ligeras",
    material: "Titanio",
    descripcion: "Protección y resistencia mejoradas.",
  },
  {
    id: "cabina_tripulada",
    ranura: "cabina",
    nombre: "Cápsula tripulada",
    precio: 260,
    masa: 240,
    fiabilidad: 82,
    investigacionRequerida: "sistema_telemetria",
    material: "Aluminio reforzado",
    descripcion: "Aloja a la tripulación y los sistemas vitales.",
  },
  {
    id: "cabina_automatica",
    ranura: "cabina",
    nombre: "Módulo automatizado",
    precio: 180,
    masa: 150,
    fiabilidad: 78,
    investigacionRequerida: "control_fundamentos",
    material: "Compuesto liviano",
    descripcion: "Compartimento para sistemas y misiones no tripuladas.",
  },
  {
    id: "cabina_blindada",
    ranura: "cabina",
    nombre: "Cápsula blindada",
    precio: 360,
    masa: 310,
    fiabilidad: 94,
    investigacionRequerida: "proteccion_radiacion",
    material: "Aleación multicapa",
    descripcion: "Mayor protección para misiones de larga duración.",
  },
  {
    id: "tanque_estandar",
    ranura: "tanque",
    nombre: "Tanque estándar",
    precio: 220,
    masa: 460,
    fiabilidad: 72,
    investigacionRequerida: "combustible_fundamentos",
    material: "Acero especial",
    descripcion: "Almacenamiento de combustible para órbita terrestre.",
  },
  {
    id: "tanque_criogenico",
    ranura: "tanque",
    nombre: "Tanque criogénico",
    precio: 390,
    masa: 520,
    fiabilidad: 86,
    investigacionRequerida: "tanques_criogenicos",
    material: "Acero criogénico",
    descripcion: "Mayor capacidad para trayectorias de espacio profundo.",
  },
  {
    id: "tanque_oxigeno_liquido",
    ranura: "tanque",
    nombre: "Tanque de oxígeno líquido",
    precio: 320,
    masa: 480,
    fiabilidad: 78,
    investigacionRequerida: "oxigeno_liquido",
    material: "Acero criogénico",
    descripcion: "Almacena oxígeno líquido para motores de alto rendimiento.",
  },
  {
    id: "tanque_solido",
    ranura: "tanque",
    nombre: "Tanque de combustible sólido",
    precio: 260,
    masa: 400,
    fiabilidad: 80,
    investigacionRequerida: "almacenamiento_solido",
    material: "Compuesto resistente",
    descripcion: "Almacenamiento compacto para propelentes sólidos.",
  },
  {
    id: "tanque_reciclaje",
    ranura: "tanque",
    nombre: "Sistema de reciclaje de combustible",
    precio: 470,
    masa: 550,
    fiabilidad: 82,
    investigacionRequerida: "reciclaje_combustible",
    material: "Sistema de recuperación",
    descripcion: "Recupera y reutiliza combustible durante la misión.",
  },
  {
    id: "alas_basicas",
    ranura: "alas",
    nombre: "Estabilizadores básicos",
    precio: 90,
    masa: 75,
    fiabilidad: 70,
    investigacionRequerida: "estructura_fundamentos",
    material: "Fibra de carbono",
    descripcion: "Control básico de estabilidad en el ascenso.",
  },
  {
    id: "alas_reforzadas",
    ranura: "alas",
    nombre: "Estabilizadores reforzados",
    precio: 160,
    masa: 110,
    fiabilidad: 88,
    investigacionRequerida: "aleaciones_ligeras",
    material: "Compuesto de carbono",
    descripcion: "Estabilidad mejorada para vehículos pesados.",
  },
  {
    id: "motor_solido",
    ranura: "motor",
    nombre: "Motor de combustible sólido",
    precio: 300,
    masa: 280,
    fiabilidad: 74,
    investigacionRequerida: "fundamentos_cientificos",
    material: "Aleación resistente al calor",
    descripcion: "Motor fiable y sencillo para lanzamientos iniciales.",
  },
  {
    id: "motor_liquido",
    ranura: "motor",
    nombre: "Motor de combustible líquido",
    precio: 460,
    masa: 330,
    fiabilidad: 87,
    investigacionRequerida: "motores_liq",
    material: "Aleación de níquel",
    descripcion: "Empuje controlable y mejor rendimiento orbital.",
  },
  {
    id: "motor_criogenico",
    ranura: "motor",
    nombre: "Motor criogénico",
    precio: 620,
    masa: 390,
    fiabilidad: 91,
    investigacionRequerida: "tanques_criogenicos",
    material: "Superaleación térmica",
    descripcion: "Alto rendimiento para misiones de larga distancia.",
  },
  {
    id: "motor_electrico",
    ranura: "motor",
    nombre: "Motor eléctrico",
    precio: 520,
    masa: 240,
    fiabilidad: 80,
    investigacionRequerida: "propulsion_electrica",
    material: "Aleación conductora",
    descripcion: "Propulsión eficiente para misiones de larga duración.",
  },
  {
    id: "motor_nuclear",
    ranura: "motor",
    nombre: "Motor nuclear",
    precio: 700,
    masa: 420,
    fiabilidad: 75,
    investigacionRequerida: "propulsion_nuclear",
    material: "Aleación de alta temperatura",
    descripcion: "Propulsión avanzada para trayectorias de espacio profundo.",
  },
  {
    id: "motor_fusion",
    ranura: "motor",
    nombre: "Motor de fusión",
    precio: 900,
    masa: 450,
    fiabilidad: 78,
    investigacionRequerida: "motor_fusion",
    material: "Superaleación experimental",
    descripcion: "Tecnología de fusión para vehículos de alta capacidad.",
  },
  {
    id: "carga_satelite",
    ranura: "carga_util",
    nombre: "Satélite artificial",
    precio: 220,
    masa: 120,
    fiabilidad: 84,
    investigacionRequerida: "carga_util_fundamentos",
    material: "Paneles y estructura orbital",
    descripcion: "Carga de comunicaciones para órbita terrestre.",
  },
  {
    id: "capsula_tripulada",
    ranura: "carga_util",
    nombre: "Cápsula tripulada",
    precio: 420,
    masa: 360,
    fiabilidad: 82,
    investigacionRequerida: "sistema_telemetria",
    material: "Módulo presurizado",
    descripcion: "Transporte seguro para una tripulación.",
  },
  {
    id: "modulo_estacion",
    ranura: "carga_util",
    nombre: "Módulo de estación",
    precio: 500,
    masa: 440,
    fiabilidad: 85,
    investigacionRequerida: "estructura_modular",
    material: "Estructura modular",
    descripcion: "Segmento habitable para una estación orbital.",
  },
  {
    id: "modulo_acoplamiento",
    ranura: "carga_util",
    nombre: "Módulo de acoplamiento",
    precio: 460,
    masa: 380,
    fiabilidad: 88,
    investigacionRequerida: "navegacion_autonoma",
    material: "Sistema de atraque",
    descripcion: "Permite aproximación y acoplamiento orbital.",
  },
  {
    id: "modulo_lunar",
    ranura: "carga_util",
    nombre: "Módulo de vuelo lunar",
    precio: 620,
    masa: 510,
    fiabilidad: 88,
    investigacionRequerida: "tanques_criogenicos",
    material: "Módulo de transferencia",
    descripcion: "Vehículo para un trayecto tripulado alrededor de la Luna.",
  },
  {
    id: "modulo_alunizaje",
    ranura: "carga_util",
    nombre: "Módulo de alunizaje",
    precio: 760,
    masa: 640,
    fiabilidad: 90,
    investigacionRequerida: "habitat_presurizado",
    material: "Estructura de descenso",
    descripcion: "Módulo preparado para descender hasta la superficie lunar.",
  },
  {
    id: "carga_observacion",
    ranura: "carga_util",
    nombre: "Instrumentos de observación",
    precio: 180,
    masa: 90,
    fiabilidad: 83,
    investigacionRequerida: "telescopios_espaciales",
    material: "Sensores ópticos",
    descripcion: "Instrumentos para estudiar la Tierra desde órbita.",
  },
  {
    id: "modulo_laboratorio",
    ranura: "carga_util",
    nombre: "Laboratorio orbital",
    precio: 380,
    masa: 320,
    fiabilidad: 86,
    investigacionRequerida: "plataforma_cientifica",
    material: "Módulo presurizado",
    descripcion: "Laboratorio para experimentos en microgravedad.",
  },
  {
    id: "carga_sonda_lunar",
    ranura: "carga_util",
    nombre: "Sonda lunar",
    precio: 250,
    masa: 140,
    fiabilidad: 84,
    investigacionRequerida: "instrumentos_roboticos",
    material: "Plataforma robótica",
    descripcion: "Sonda automática para estudiar la Luna.",
  },
  {
    id: "carga_cartografia",
    ranura: "carga_util",
    nombre: "Instrumento de cartografía",
    precio: 230,
    masa: 130,
    fiabilidad: 86,
    investigacionRequerida: "telescopios_espaciales",
    material: "Sensores de imagen",
    descripcion: "Equipo para cartografiar la superficie lunar.",
  },
  {
    id: "carga_sensores_lunares",
    ranura: "carga_util",
    nombre: "Sensores de prospección",
    precio: 270,
    masa: 160,
    fiabilidad: 85,
    investigacionRequerida: "navegacion_autonoma",
    material: "Sensores espectrales",
    descripcion: "Sensores para caracterizar un sitio de alunizaje.",
  },
  {
    id: "carga_rover",
    ranura: "carga_util",
    nombre: "Rover lunar",
    precio: 480,
    masa: 390,
    fiabilidad: 87,
    investigacionRequerida: "rovers_exploracion",
    material: "Vehículo robótico",
    descripcion: "Rover para explorar la superficie lunar.",
  },
  {
    id: "cabina_termica",
    ranura: "cabina",
    nombre: "Cabina con control térmico",
    precio: 320,
    masa: 270,
    fiabilidad: 86,
    investigacionRequerida: "control_termico",
    material: "Aislamiento multicapa",
    descripcion:
      "Protege los sistemas internos de cambios extremos de temperatura.",
  },
  {
    id: "cabina_autonoma",
    ranura: "cabina",
    nombre: "Cabina autónoma",
    precio: 340,
    masa: 230,
    fiabilidad: 88,
    investigacionRequerida: "autonomia_mision",
    material: "Sistema de control autónomo",
    descripcion:
      "Coordina las operaciones del vehículo sin intervención directa.",
  },
  {
    id: "carga_comunicaciones",
    ranura: "carga_util",
    nombre: "Carga de comunicaciones",
    precio: 360,
    masa: 150,
    fiabilidad: 88,
    investigacionRequerida: "satelites_comunicacion",
    material: "Antenas y transmisores",
    descripcion: "Sistema avanzado de comunicación por satélite.",
  },
];

const COMPONENTES_POR_ID = new Map(
  COMPONENTES.map((componente) => [componente.id, componente]),
);
const RANURAS_POR_ID = new Map(RANURAS.map((ranura) => [ranura.id, ranura]));
const INVESTIGACIONES = Object.values(ARBOLES_INVESTIGACION).flatMap(
  ({ nodos }) => nodos,
);
const INVESTIGACIONES_POR_ID = new Map(
  INVESTIGACIONES.map((investigacion) => [
    investigacion.id,
    investigacion,
  ]),
);
const INVESTIGACIONES_INICIALES = new Set(
  INVESTIGACIONES.filter(({ inicial }) => inicial).map(({ id }) => id),
);
const COMPONENTES_BASICOS_SIN_INVESTIGACION = new Set(["punta_estandar"]);
const IDS_LEGACY = {
  punta: "punta_estandar",
  cabina: "cabina_tripulada",
  tanque: "tanque_estandar",
  alas: "alas_basicas",
  motor: "motor_solido",
};

const componentesVinculados = new Set();
INVESTIGACIONES.forEach((investigacion) => {
  if (!investigacion.componenteId) {
    throw new Error(
      `La investigación "${investigacion.id}" no tiene un componente vinculado.`,
    );
  }
  const componente = COMPONENTES_POR_ID.get(investigacion.componenteId);
  if (!componente) {
    throw new Error(
      `La investigación "${investigacion.id}" referencia el componente inexistente "${investigacion.componenteId}".`,
    );
  }
  if (componentesVinculados.has(componente.id)) {
    throw new Error(
      `El componente "${componente.id}" está vinculado a más de una investigación.`,
    );
  }
  if (componente.investigacionRequerida !== investigacion.id) {
    throw new Error(
      `El componente "${componente.id}" no requiere la investigación que lo vincula.`,
    );
  }
  componentesVinculados.add(componente.id);
});

COMPONENTES.forEach((componente) => {
  if (
    !componente.investigacionRequerida &&
    !COMPONENTES_BASICOS_SIN_INVESTIGACION.has(componente.id)
  ) {
    throw new Error(
      `El componente "${componente.id}" no está vinculado a una investigación.`,
    );
  }
  if (
    componente.investigacionRequerida &&
    !INVESTIGACIONES_POR_ID.has(componente.investigacionRequerida)
  ) {
    throw new Error(
      `El componente "${componente.id}" requiere la investigación inexistente "${componente.investigacionRequerida}".`,
    );
  }
});

["punta", "tanque", "motor", "carga_util"].forEach((ranura) => {
  const tieneComponenteInicial = COMPONENTES.some(
    (componente) =>
      componente.ranura === ranura &&
      (!componente.investigacionRequerida ||
        INVESTIGACIONES_INICIALES.has(componente.investigacionRequerida)),
  );
  if (!tieneComponenteInicial) {
    throw new Error(
      `La ranura básica "${ranura}" no tiene un componente disponible desde el inicio.`,
    );
  }
});

function formatearMasa(masa) {
  return `${masa.toLocaleString("es-AR", { maximumFractionDigits: 2 })} kg`;
}

function normalizarPartes(partes) {
  const normalizadas = {};
  const valores = Array.isArray(partes)
    ? partes.map((id) => {
        const idActual = IDS_LEGACY[id] ?? id;
        const componente = COMPONENTES_POR_ID.get(idActual);
        return componente ? [componente.ranura, idActual] : null;
      })
    : partes && typeof partes === "object"
      ? Object.entries(partes).map(([ranura, id]) => {
          const idActual = IDS_LEGACY[id] ?? id;
          const componente = COMPONENTES_POR_ID.get(idActual);
          return componente?.ranura === ranura ? [ranura, idActual] : null;
        })
      : [];

  valores.forEach((valor) => {
    if (valor && !normalizadas[valor[0]]) {
      normalizadas[valor[0]] = valor[1];
    }
  });
  return normalizadas;
}

function obtenerTaller(partida) {
  return {
    partesInstaladas: normalizarPartes(partida.taller?.partesInstaladas),
  };
}

function obtenerComponentesInstalados(taller) {
  return Object.values(taller.partesInstaladas)
    .map((id) => COMPONENTES_POR_ID.get(id))
    .filter(Boolean);
}

function obtenerInvestigacionesCompletadas(partida) {
  const completadas = new Set(
    Array.isArray(partida.investigacionesCompletadas)
      ? partida.investigacionesCompletadas
      : [],
  );
  INVESTIGACIONES_INICIALES.forEach((id) => completadas.add(id));
  return completadas;
}

function obtenerInvestigacionRequerida(componente) {
  return componente.investigacionRequerida
    ? INVESTIGACIONES_POR_ID.get(componente.investigacionRequerida)
    : null;
}

function obtenerComponentesBloqueados(taller, investigaciones) {
  return obtenerComponentesInstalados(taller).filter((componente) => {
    const investigacion = obtenerInvestigacionRequerida(componente);
    return investigacion && !investigaciones.has(investigacion.id);
  });
}

export function calcularProbabilidad(componentes) {
  const fiabilidad = componentes
    .filter(({ ranura }) => ranura !== "carga_util")
    .reduce((total, componente) => total + componente.fiabilidad, 0);

  const promedio = fiabilidad / (RANURAS.length - 1);
  return Math.max(5, Math.min(95, Math.round(20 + promedio * 0.85)));
}

export default function inicializarTaller({ onResourcesChanged } = {}) {
  const inventarioPartes = document.getElementById("taller-partes");
  const cohete = document.getElementById("taller-cohete");
  const presupuesto = document.getElementById("taller-presupuesto");
  const totalCohete = document.getElementById("taller-total-cohete");
  const masaCohete = document.getElementById("taller-masa-cohete");
  const gastos = document.getElementById("taller-gastos");
  const tituloMision = document.getElementById("taller-mision-titulo");
  const duracionMision = document.getElementById("taller-mision-duracion");
  const condicionesMision = document.getElementById(
    "taller-condiciones-mision",
  );
  const probabilidadExito = document.getElementById(
    "taller-probabilidad-exito",
  );
  const btnLanzar = document.getElementById("taller-lanzar");
  const resultadoLanzamiento = document.getElementById(
    "taller-resultado-lanzamiento",
  );
  const aviso = document.getElementById("taller-aviso");
  const btnDesmontar = document.getElementById("taller-desmontar");

  if (
    !inventarioPartes ||
    !cohete ||
    !presupuesto ||
    !totalCohete ||
    !masaCohete ||
    !gastos ||
    !tituloMision ||
    !duracionMision ||
    !condicionesMision ||
    !probabilidadExito ||
    !btnLanzar ||
    !resultadoLanzamiento ||
    !aviso ||
    !btnDesmontar
  ) {
    throw new Error("No se encontraron los elementos del taller");
  }

  let elementoSeleccionado = null;

  function obtenerPartida() {
    const partida = gameState.obtenerSlotActual();
    if (!partida) {
      throw new Error("No hay una campaña activa para usar el taller.");
    }
    return partida;
  }

  function mostrarAviso(texto) {
    aviso.textContent = texto;
  }

  function guardarCambios(cambios) {
    const partidaActualizada = gameState.actualizarSlotActual(cambios);
    if (!partidaActualizada) {
      throw new Error("No se pudieron guardar los cambios del taller.");
    }
    onResourcesChanged?.(partidaActualizada);
    return partidaActualizada;
  }

  function crearElementoInventario(
    componente,
    ranura,
    instalado,
    investigaciones,
  ) {
    const requisito = obtenerInvestigacionRequerida(componente);
    const bloqueado = requisito && !investigaciones.has(requisito.id);
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "taller-pieza";
    boton.draggable = !instalado && !bloqueado;
    boton.dataset.tallerItem = componente.id;
    boton.setAttribute("aria-pressed", "false");
    boton.setAttribute(
      "aria-label",
      `${componente.nombre}, $${componente.precio}, masa ${formatearMasa(componente.masa)}, fiabilidad ${componente.fiabilidad}%. ${componente.descripcion}${bloqueado ? ` Requiere investigar ${requisito.label}.` : ""}`,
    );
    if (bloqueado) {
      boton.classList.add("taller-pieza-bloqueada");
    }
    if (instalado) {
      boton.classList.add("taller-pieza-ocupada");
    }
    if (instalado || bloqueado) {
      boton.disabled = true;
    }

    const icono = document.createElement("span");
    icono.className = "taller-pieza-icono material-symbols-outlined";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = ranura.icono;

    const detalles = document.createElement("span");
    detalles.className = "taller-pieza-detalles";

    const nombre = document.createElement("strong");
    nombre.textContent = componente.nombre;

    const costo = document.createElement("small");
    costo.textContent = `$${componente.precio.toLocaleString("es-AR")} · ${formatearMasa(componente.masa)} · ${componente.fiabilidad}% fiabilidad`;

    detalles.append(nombre, costo);
    if (bloqueado) {
      const requisitoTexto = document.createElement("small");
      requisitoTexto.className = "taller-pieza-requisito";
      requisitoTexto.textContent = `Requiere: ${requisito.label}`;
      detalles.append(requisitoTexto);
    }
    boton.append(icono, detalles);
    return boton;
  }

  function renderizarInventarios(taller, investigaciones) {
    inventarioPartes.replaceChildren(
      ...RANURAS.map((ranura) => {
        const grupo = document.createElement("section");
        grupo.className = "taller-grupo-partes";

        const titulo = document.createElement("h4");
        titulo.textContent = ranura.nombre;

        const opciones = document.createElement("div");
        opciones.className = "taller-lista-opciones";
        COMPONENTES.filter(({ ranura: id }) => id === ranura.id).forEach(
          (componente) => {
            opciones.append(
              crearElementoInventario(
                componente,
                ranura,
                taller.partesInstaladas[ranura.id] === componente.id,
                investigaciones,
              ),
            );
          },
        );

        grupo.append(titulo, opciones);
        return grupo;
      }),
    );

    if (elementoSeleccionado) {
      document.querySelectorAll("[data-taller-item]").forEach((boton) => {
        const seleccionado =
          boton.dataset.tallerItem === elementoSeleccionado.id;
        boton.classList.toggle("taller-pieza-seleccionada", seleccionado);
        boton.setAttribute("aria-pressed", String(seleccionado));
      });
    }
  }

  function renderizarCohete(taller) {
    cohete.querySelectorAll("[data-zona-parte]").forEach((zona) => {
      const idRanura = zona.dataset.zonaParte;
      const componente = COMPONENTES_POR_ID.get(
        taller.partesInstaladas[idRanura],
      );
      const instalada = Boolean(componente);
      const icono = zona.querySelector(".taller-zona-icono");
      const etiqueta = zona.querySelector("span:last-child");
      const btnQuitar = cohete.querySelector(
        `[data-quitar-parte="${idRanura}"]`,
      );
      const nombreRanura = RANURAS_POR_ID.get(idRanura).nombre;

      zona.classList.toggle("taller-zona-instalada", instalada);
      icono.textContent = instalada
        ? RANURAS_POR_ID.get(idRanura).icono
        : icono.dataset.icono;
      etiqueta.textContent = instalada
        ? componente.nombre
        : zona.dataset.etiqueta;
      zona.setAttribute(
        "aria-label",
        instalada
          ? `${componente.nombre} instalado en ${nombreRanura}.`
          : `Posición para ${nombreRanura}. Selecciona o arrastra una variante.`,
      );
      btnQuitar.hidden = !instalada;
    });
  }

  function renderizarResumen(taller, partida) {
    const componentes = obtenerComponentesInstalados(taller);
    const totalPartes = componentes.reduce(
      (total, componente) => total + componente.precio,
      0,
    );
    const masaTotalCohete = componentes.reduce(
      (total, componente) => total + componente.masa,
      0,
    );
    const fondos = Number(partida.presupuesto ?? 0);

    presupuesto.textContent = `$${fondos.toLocaleString("es-AR")}`;
    totalCohete.textContent = `$${totalPartes.toLocaleString("es-AR")}`;
    masaCohete.textContent = formatearMasa(masaTotalCohete);

    gastos.replaceChildren();
    if (componentes.length === 0) {
      const vacio = document.createElement("li");
      vacio.textContent = "Todavía no hay gastos.";
      gastos.append(vacio);
    } else {
      componentes.forEach((componente) => {
        const registro = document.createElement("li");
        registro.textContent = `${componente.nombre}: $${componente.precio.toLocaleString("es-AR")}`;
        gastos.append(registro);
      });
    }
  }

  function renderizarCondiciones(partida, taller) {
    const idMision =
      partida.misionEnCurso?.id ?? partida.misionActual ?? MISIONES[0].id;
    const mision = MISIONES.find(({ id }) => id === idMision);
    if (!mision) {
      throw new Error(`La misión seleccionada "${idMision}" no existe.`);
    }

    const activa = partida.misionEnCurso?.id === mision.id;
    const investigaciones = obtenerInvestigacionesCompletadas(partida);
    const condiciones = obtenerCondicionesVictoria(mision, {
      ...partida,
      taller,
    });
    const componentesBloqueados = obtenerComponentesBloqueados(
      taller,
      investigaciones,
    );
    condiciones.push(
      ...componentesBloqueados.map((componente) => ({
        etiqueta: `Investigar ${obtenerInvestigacionRequerida(componente).label} para utilizar ${componente.nombre}.`,
        cumplida: false,
      })),
    );
    const faltantes = condiciones.filter(({ cumplida }) => !cumplida);
    const componentes = obtenerComponentesInstalados(taller);
    const probabilidad = calcularProbabilidad(componentes);
    const mesesTranscurridos = activa
      ? Math.max(
          0,
          Number(partida.mes ?? 1) - Number(partida.misionEnCurso.mesInicio),
        )
      : null;
    const ultimoResultado =
      partida.ultimoResultadoMision?.misionId === mision.id
        ? partida.ultimoResultadoMision
        : null;

    tituloMision.textContent = activa
      ? `En curso: ${mision.label}`
      : mision.label;
    duracionMision.textContent = activa
      ? `${mesesTranscurridos} meses transcurridos · duración estimada: ${mision.duracionMeses} meses`
      : `Duración estimada: ${mision.duracionMeses} meses. Inicia la misión desde el árbol para poder lanzarla.`;

    condicionesMision.replaceChildren(
      ...condiciones.map((condicion) => {
        const elemento = document.createElement("li");
        elemento.classList.toggle(
          "taller-condicion-cumplida",
          condicion.cumplida,
        );
        const icono = document.createElement("span");
        icono.className = "material-symbols-outlined";
        icono.setAttribute("aria-hidden", "true");
        icono.textContent = condicion.cumplida
          ? "check_circle"
          : "radio_button_unchecked";
        const etiqueta = document.createElement("span");
        etiqueta.textContent = condicion.etiqueta;
        elemento.append(icono, etiqueta);
        return elemento;
      }),
    );

    probabilidadExito.textContent = `${probabilidad}%`;
    btnLanzar.disabled = !activa || faltantes.length > 0;

    if (!ultimoResultado) {
      resultadoLanzamiento.textContent = "";
    } else if (ultimoResultado.exito) {
      resultadoLanzamiento.textContent = `Último lanzamiento: éxito (tirada ${ultimoResultado.tirada} frente a ${ultimoResultado.probabilidad}%). Recompensa: $${mision.recompensa.presupuesto.toLocaleString("es-AR")} y ${mision.recompensa.ciencia.toLocaleString("es-AR")} puntos de investigación.`;
    } else {
      resultadoLanzamiento.textContent = `Último lanzamiento: fallo (tirada ${ultimoResultado.tirada} frente a ${ultimoResultado.probabilidad}%). No se otorgó recompensa; modifica el cohete y vuelve a intentarlo.`;
    }
  }

  function actualizarTaller() {
    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    renderizarInventarios(taller, obtenerInvestigacionesCompletadas(partida));
    renderizarCohete(taller);
    renderizarResumen(taller, partida);
    renderizarCondiciones(partida, taller);
  }

  function instalarComponente(id, idRanura) {
    const componente = COMPONENTES_POR_ID.get(id);
    if (!componente) {
      mostrarAviso("Componente no válido.");
      return;
    }
    if (idRanura !== componente.ranura) {
      mostrarAviso("Ese componente no corresponde a esta posición.");
      return;
    }

    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    const investigacion = obtenerInvestigacionRequerida(componente);
    if (
      investigacion &&
      !obtenerInvestigacionesCompletadas(partida).has(investigacion.id)
    ) {
      mostrarAviso(
        `Investiga ${investigacion.label} antes de instalar ${componente.nombre}.`,
      );
      return;
    }
    const idAnterior = taller.partesInstaladas[idRanura];
    if (idAnterior === id) {
      mostrarAviso(`${componente.nombre} ya está instalado.`);
      return;
    }

    const anterior = COMPONENTES_POR_ID.get(idAnterior);
    const diferenciaPrecio = componente.precio - (anterior?.precio ?? 0);
    const fondos = Number(partida.presupuesto ?? 0);
    if (fondos < diferenciaPrecio) {
      mostrarAviso(`Fondos insuficientes para instalar ${componente.nombre}.`);
      return;
    }

    guardarCambios({
      presupuesto: fondos - diferenciaPrecio,
      taller: {
        partesInstaladas: {
          ...taller.partesInstaladas,
          [idRanura]: id,
        },
      },
    });
    elementoSeleccionado = null;
    actualizarTaller();
    mostrarAviso(
      anterior
        ? `${componente.nombre} instalado; se ajustó el costo de la pieza anterior.`
        : `${componente.nombre} instalado.`,
    );
  }

  function quitarComponente(idRanura) {
    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    const idComponente = taller.partesInstaladas[idRanura];
    const componente = COMPONENTES_POR_ID.get(idComponente);
    if (!componente) return;

    const partesInstaladas = { ...taller.partesInstaladas };
    delete partesInstaladas[idRanura];
    guardarCambios({
      presupuesto: Number(partida.presupuesto ?? 0) + componente.precio,
      taller: { partesInstaladas },
    });
    actualizarTaller();
    mostrarAviso(`${componente.nombre} desmontado; se devolvió su costo.`);
  }

  function obtenerIdArrastrado(evento) {
    return evento.dataTransfer?.getData("text/plain") ?? "";
  }

  inventarioPartes.onclick = (evento) => {
    const objetivo = evento.target instanceof Element ? evento.target : null;
    const boton = objetivo?.closest("[data-taller-item]");
    if (!boton || boton.disabled) return;

    const id = boton.dataset.tallerItem;
    const nombre = boton.querySelector("strong").textContent;
    elementoSeleccionado = elementoSeleccionado?.id === id ? null : { id };
    actualizarTaller();
    mostrarAviso(
      elementoSeleccionado
        ? `Seleccionado: ${nombre}. Elige una posición de montaje.`
        : "Selección cancelada.",
    );
  };

  inventarioPartes.ondragstart = (evento) => {
    const objetivo = evento.target instanceof Element ? evento.target : null;
    const boton = objetivo?.closest("[data-taller-item]");
    if (!boton || boton.disabled || !evento.dataTransfer) return;
    evento.dataTransfer.effectAllowed = "move";
    evento.dataTransfer.setData("text/plain", boton.dataset.tallerItem);
  };

  cohete.onclick = (evento) => {
    const objetivo = evento.target instanceof Element ? evento.target : null;
    const botonDesmontar = objetivo?.closest("[data-quitar-parte]");
    if (botonDesmontar) {
      quitarComponente(botonDesmontar.dataset.quitarParte);
      return;
    }

    const zona = objetivo?.closest("[data-zona-parte]");
    if (zona && elementoSeleccionado) {
      instalarComponente(elementoSeleccionado.id, zona.dataset.zonaParte);
    }
  };

  cohete.querySelectorAll("[data-zona-parte]").forEach((zona) => {
    zona.ondragover = (evento) => {
      evento.preventDefault();
      zona.classList.add("taller-zona-hover");
    };
    zona.ondragleave = () => zona.classList.remove("taller-zona-hover");
    zona.ondrop = (evento) => {
      evento.preventDefault();
      zona.classList.remove("taller-zona-hover");
      const idComponente = obtenerIdArrastrado(evento);
      if (!idComponente) {
        mostrarAviso("Arrastra un componente a su posición.");
        return;
      }
      instalarComponente(idComponente, zona.dataset.zonaParte);
    };
  });

  btnLanzar.onclick = () => {
    const partida = obtenerPartida();
    const misionId = partida.misionEnCurso?.id;
    const mision = MISIONES.find(({ id }) => id === misionId);
    if (!mision) {
      mostrarAviso("Inicia una misión desbloqueada antes de lanzar.");
      return;
    }

    const taller = obtenerTaller(partida);
    const condiciones = obtenerCondicionesVictoria(mision, {
      ...partida,
      taller,
    });
    const componentesBloqueados = obtenerComponentesBloqueados(
      taller,
      obtenerInvestigacionesCompletadas(partida),
    );
    if (
      condiciones.some(({ cumplida }) => !cumplida) ||
      componentesBloqueados.length > 0
    ) {
      actualizarTaller();
      mostrarAviso("No se puede lanzar: todavía faltan condiciones.");
      return;
    }

    const probabilidad = calcularProbabilidad(
      obtenerComponentesInstalados(taller),
    );
    const tirada = Math.floor(Math.random() * 100) + 1;
    const exito = tirada <= probabilidad;
    const resultado = {
      misionId: mision.id,
      mes: Number(partida.mes ?? 1),
      probabilidad,
      tirada,
      exito,
    };
    const cambios = { ultimoResultadoMision: resultado };

    if (exito) {
      const misionesCompletadas = new Set(
        Array.isArray(partida.misionesCompletadas)
          ? partida.misionesCompletadas
          : [],
      );
      misionesCompletadas.add(mision.id);
      cambios.misionesCompletadas = [...misionesCompletadas];
      cambios.misionEnCurso = null;
      cambios.presupuesto =
        Number(partida.presupuesto ?? 0) + mision.recompensa.presupuesto;
      cambios.ciencia =
        Number(partida.ciencia ?? 0) + mision.recompensa.ciencia;
    }

    const partidaActualizada = guardarCambios(cambios);
    if (exito && !partidaActualizada.misionesCompletadas.includes(mision.id)) {
      throw new Error(`No se pudo completar la misión "${mision.label}".`);
    }
    actualizarTaller();
    mostrarAviso(
      exito
        ? `¡Lanzamiento exitoso! Recibiste $${mision.recompensa.presupuesto.toLocaleString("es-AR")} y ${mision.recompensa.ciencia.toLocaleString("es-AR")} puntos de investigación.`
        : `Lanzamiento fallido. La tirada fue ${tirada}; la probabilidad era ${probabilidad}%. Puedes ajustar el cohete e intentarlo de nuevo.`,
    );
    abrirDialogoDinamico({
      titulo: exito ? "¡Felicitaciones!" : "Lanzamiento fallido",
      contenido: exito
        ? `El lanzamiento de "${mision.label}" fue un éxito. ¡Completaste la beta de Space Mission! Gracias por jugar y probar el proyecto. Puedes continuar con las misiones que desbloqueaste.`
        : `La tirada fue ${tirada} y la probabilidad de éxito era ${probabilidad}%. No te desanimes: vuelve a intentarlo con nuevas combinaciones de componentes e investiga tecnologías para desbloquear nuevas piezas y mejorar tus posibilidades.`,
      acciones: [
        {
          texto: exito ? "Continuar jugando" : "Volver al taller",
        },
      ],
    });
  };

  btnDesmontar.onclick = () => {
    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    const totalReembolsable = obtenerComponentesInstalados(taller).reduce(
      (total, componente) => total + componente.precio,
      0,
    );

    if (totalReembolsable === 0) {
      mostrarAviso("No hay componentes que desmontar.");
      return;
    }
    if (!confirm("¿Desmontar el vehículo y devolver el costo de sus piezas?")) {
      return;
    }

    guardarCambios({
      presupuesto: Number(partida.presupuesto ?? 0) + totalReembolsable,
      taller: { partesInstaladas: {} },
    });
    elementoSeleccionado = null;
    actualizarTaller();
    mostrarAviso("Montaje desmontado. Se devolvieron los fondos utilizados.");
  };

  actualizarTaller();
  tutorialCuandoSeVea(
    "taller-intro",
    document.querySelector('[data-juego-panel="taller"]'),
    {
      pasos: [
        {
          texto:
            "¡Bienvenido al Taller! Aquí preparas el cohete para la misión que tienes en curso.",
          expresion: "saludo",
        },
        {
          texto:
            "Este es el inventario. Elige una pieza disponible; las que requieren tecnologías todavía no investigadas aparecen bloqueadas.",
          resaltar: () => document.querySelector(".taller-inventario"),
        },
        {
          texto:
            "Selecciona una pieza y luego su posición en el cohete, o arrástrala hasta allí. Cada pieza solo encaja en su ranura.",
          resaltar: () => document.getElementById("taller-cohete"),
        },
        {
          texto:
            "El resumen muestra el presupuesto restante, el costo de las piezas y la masa total del vehículo en kilogramos.",
          resaltar: () => document.querySelector(".taller-resumen"),
        },
        {
          texto:
            "Revisa las condiciones de la misión y la probabilidad estimada. El lanzamiento se habilita cuando el cohete cumple todos los requisitos; la carga útil no afecta la probabilidad de éxito.",
          expresion: "pensando",
          resaltar: () => document.querySelector(".taller-resumen"),
        },
      ],
    },
  );
  return actualizarTaller;
}
