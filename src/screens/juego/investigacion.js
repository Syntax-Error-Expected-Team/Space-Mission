import gameState from "../../game-state.js";
import { guardarCategoriaInvestigacion } from "../../navigation-state.js";
import { tutorialCuandoSeVea, tutorialUnaVez } from "../../robot.js";
import { desbloquearInformacionPorHito } from "./informacion.js";

export const ARBOLES_INVESTIGACION = {
  propulsion: {
    nodos: [
      {
        id: "fundamentos_cientificos",
        componenteId: "motor_solido",
        label: "Fundamentos de propulsión",
        position: { x: 16, y: 50 },
        icon: "science",
        costo: 0,
        inicial: true,
      },
      {
        id: "motores_liq",
        componenteId: "motor_liquido",
        label: "Motores de combustion liquida",
        position: { x: 40, y: 50 },
        icon: "rocket",
        costo: 20,
      },
      {
        id: "propulsion_electrica",
        componenteId: "motor_electrico",
        label: "Propulsión eléctrica",
        position: { x: 65, y: 25 },
        icon: "electric_bolt",
        costo: 40,
      },
      {
        id: "propulsion_nuclear",
        componenteId: "motor_nuclear",
        label: "Propulsión nuclear",
        position: { x: 65, y: 75 },
        icon: "flare",
        costo: 50,
      },
      {
        id: "motor_fusion",
        componenteId: "motor_fusion",
        label: "Motor de fusión",
        position: { x: 88, y: 50 },
        icon: "rocket_launch",
        costo: 70,
      },
    ],
    conexiones: [
      ["fundamentos_cientificos", "motores_liq"],
      ["motores_liq", "propulsion_electrica"],
      ["motores_liq", "propulsion_nuclear"],
      ["propulsion_electrica", "motor_fusion"],
      ["propulsion_nuclear", "motor_fusion"],
    ],
  },
  combustible: {
    nodos: [
      {
        id: "combustible_fundamentos",
        componenteId: "tanque_estandar",
        label: "Fundamentos de combustible",
        position: { x: 16, y: 50 },
        icon: "science",
        costo: 0,
        inicial: true,
      },
      {
        id: "oxigeno_liquido",
        componenteId: "tanque_oxigeno_liquido",
        label: "Tanque de Oxigeno Líquido",
        position: { x: 40, y: 50 },
        icon: "spo2",
        costo: 20,
      },
      {
        id: "tanques_criogenicos",
        componenteId: "tanque_criogenico",
        label: "Tanques criogénicos",
        position: { x: 65, y: 25 },
        icon: "propane_tank",
        costo: 40,
      },
      {
        id: "almacenamiento_solido",
        componenteId: "tanque_solido",
        label: "Almacenamiento sólido",
        position: { x: 65, y: 75 },
        icon: "battery_full",
        costo: 35,
      },
      {
        id: "reciclaje_combustible",
        componenteId: "tanque_reciclaje",
        label: "Reciclaje de combustible",
        position: { x: 88, y: 50 },
        icon: "recycling",
        costo: 60,
      },
    ],
    conexiones: [
      ["combustible_fundamentos", "oxigeno_liquido"],
      ["oxigeno_liquido", "tanques_criogenicos"],
      ["oxigeno_liquido", "almacenamiento_solido"],
      ["tanques_criogenicos", "reciclaje_combustible"],
      ["almacenamiento_solido", "reciclaje_combustible"],
    ],
  },
  control: {
    nodos: [
      {
        id: "control_fundamentos",
        componenteId: "cabina_automatica",
        label: "Fundamentos de control",
        position: { x: 16, y: 50 },
        icon: "science",
        costo: 0,
        inicial: true,
      },
      {
        id: "sistema_telemetria",
        componenteId: "cabina_tripulada",
        label: "Sistema de Telemetría",
        position: { x: 40, y: 50 },
        icon: "memory",
        costo: 20,
      },
      {
        id: "navegacion_autonoma",
        componenteId: "modulo_acoplamiento",
        label: "Navegación autónoma",
        position: { x: 65, y: 25 },
        icon: "explore",
        costo: 40,
      },
      {
        id: "control_termico",
        componenteId: "cabina_termica",
        label: "Control térmico",
        position: { x: 65, y: 75 },
        icon: "device_thermostat",
        costo: 35,
      },
      {
        id: "autonomia_mision",
        componenteId: "cabina_autonoma",
        label: "Autonomía de misión",
        position: { x: 88, y: 50 },
        icon: "smart_toy",
        costo: 60,
      },
    ],
    conexiones: [
      ["control_fundamentos", "sistema_telemetria"],
      ["sistema_telemetria", "navegacion_autonoma"],
      ["sistema_telemetria", "control_termico"],
      ["navegacion_autonoma", "autonomia_mision"],
      ["control_termico", "autonomia_mision"],
    ],
  },
  "carga-util": {
    nodos: [
      {
        id: "carga_util_fundamentos",
        componenteId: "carga_satelite",
        label: "Fundamentos de carga útil",
        position: { x: 16, y: 50 },
        icon: "science",
        costo: 0,
        inicial: true,
      },
      {
        id: "satelites_comunicacion",
        componenteId: "carga_comunicaciones",
        label: "Satélites de comunicación",
        position: { x: 40, y: 25 },
        icon: "satellite_alt",
        costo: 20,
      },
      {
        id: "telescopios_espaciales",
        componenteId: "carga_cartografia",
        label: "Telescopios espaciales",
        position: { x: 40, y: 75 },
        icon: "travel_explore",
        costo: 25,
      },
      {
        id: "rovers_exploracion",
        componenteId: "carga_rover",
        label: "Rovers de exploración",
        position: { x: 65, y: 25 },
        icon: "precision_manufacturing",
        costo: 40,
      },
      {
        id: "instrumentos_roboticos",
        componenteId: "carga_sonda_lunar",
        label: "Instrumentos robóticos",
        position: { x: 65, y: 75 },
        icon: "settings_input_component",
        costo: 45,
      },
      {
        id: "plataforma_cientifica",
        componenteId: "modulo_laboratorio",
        label: "Plataforma científica integrada",
        position: { x: 88, y: 50 },
        icon: "science",
        costo: 70,
      },
    ],
    conexiones: [
      ["carga_util_fundamentos", "satelites_comunicacion"],
      ["carga_util_fundamentos", "telescopios_espaciales"],
      ["satelites_comunicacion", "rovers_exploracion"],
      ["telescopios_espaciales", "instrumentos_roboticos"],
      ["rovers_exploracion", "plataforma_cientifica"],
      ["instrumentos_roboticos", "plataforma_cientifica"],
    ],
  },
  estructura: {
    nodos: [
      {
        id: "estructura_fundamentos",
        componenteId: "alas_basicas",
        label: "Fundamentos estructurales",
        position: { x: 16, y: 50 },
        icon: "science",
        costo: 0,
        inicial: true,
      },
      {
        id: "aleaciones_ligeras",
        componenteId: "punta_reforzada",
        label: "Aleaciones ligeras",
        position: { x: 40, y: 50 },
        icon: "category",
        costo: 20,
      },
      {
        id: "proteccion_radiacion",
        componenteId: "cabina_blindada",
        label: "Protección contra radiación",
        position: { x: 65, y: 25 },
        icon: "shield",
        costo: 35,
      },
      {
        id: "estructura_modular",
        componenteId: "modulo_estacion",
        label: "Estructura modular",
        position: { x: 65, y: 75 },
        icon: "view_in_ar",
        costo: 40,
      },
      {
        id: "habitat_presurizado",
        componenteId: "modulo_alunizaje",
        label: "Hábitat presurizado",
        position: { x: 88, y: 50 },
        icon: "home",
        costo: 60,
      },
    ],
    conexiones: [
      ["estructura_fundamentos", "aleaciones_ligeras"],
      ["aleaciones_ligeras", "proteccion_radiacion"],
      ["aleaciones_ligeras", "estructura_modular"],
      ["proteccion_radiacion", "habitat_presurizado"],
      ["estructura_modular", "habitat_presurizado"],
    ],
  },
};

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function obtenerPartida() {
  const partida = gameState.obtenerSlotActual();
  if (!partida) {
    throw new Error("No hay una campaña activa para mostrar la investigación.");
  }

  return partida;
}

function obtenerCompletadas(partida, arbol) {
  const completadas = new Set(partida.investigacionesCompletadas ?? []);
  arbol.nodos.filter((nodo) => nodo.inicial).forEach(({ id }) => {
    completadas.add(id);
  });
  return completadas;
}

function renderizarArbol(arbol, contenedorNodos, contenedorConexiones) {
  const nodosPorId = new Map(arbol.nodos.map((nodo) => [nodo.id, nodo]));
  contenedorNodos.replaceChildren();
  contenedorConexiones.replaceChildren();

  arbol.conexiones.forEach(([origenId, destinoId]) => {
    const origen = nodosPorId.get(origenId);
    const destino = nodosPorId.get(destinoId);

    if (!origen || !destino) {
      throw new Error(
        `La conexión de investigación "${origenId}-${destinoId}" referencia un nodo inexistente.`,
      );
    }

    const linea = document.createElementNS(SVG_NAMESPACE, "line");
    linea.setAttribute("x1", origen.position.x);
    linea.setAttribute("y1", origen.position.y);
    linea.setAttribute("x2", destino.position.x);
    linea.setAttribute("y2", destino.position.y);
    linea.classList.add("investigacion-conexion");
    contenedorConexiones.append(linea);
  });

  arbol.nodos.forEach((nodo) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "investigacion-nodo";
    boton.dataset.investigacion = nodo.id;
    boton.style.left = `${nodo.position.x}%`;
    boton.style.top = `${nodo.position.y}%`;
    boton.setAttribute(
      "aria-label",
      `${nodo.label}, costo ${nodo.costo} puntos`,
    );

    const icono = document.createElement("span");
    icono.className = "material-symbols-outlined investigacion-nodo-icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = nodo.icon;

    const nombre = document.createElement("strong");
    nombre.className = "investigacion-nodo-nombre";
    nombre.textContent = nodo.label;

    const costo = document.createElement("span");
    costo.className = "investigacion-nodo-costo";
    costo.textContent = nodo.inicial ? "Inicial" : `${nodo.costo} puntos`;

    boton.append(icono, nombre, costo);
    contenedorNodos.append(boton);
  });
}

export default function inicializarInvestigacion({
  onResourcesChanged,
  categoriaInicial = "propulsion",
}) {
  const botonesCategoria = document.querySelectorAll(
    "[data-investigacion-categoria]",
  );
  const contenedorNodos = document.getElementById("nodos-investigacion");
  const contenedorConexiones = document.getElementById(
    "conexiones-investigacion",
  );
  const mensaje = document.getElementById("investigacion-mensaje");

  if (
    !botonesCategoria.length ||
    !contenedorNodos ||
    !contenedorConexiones ||
    !mensaje
  ) {
    throw new Error(
      "No se encontraron los elementos del árbol de investigación.",
    );
  }

  let categoriaActual = categoriaInicial;

  function obtenerArbolActual() {
    const arbol = ARBOLES_INVESTIGACION[categoriaActual];
    if (!arbol) {
      throw new Error(
        `La categoría de investigación "${categoriaActual}" no existe.`,
      );
    }
    return arbol;
  }

  function actualizarNodos() {
    const partida = obtenerPartida();
    const arbol = obtenerArbolActual();
    const completadas = obtenerCompletadas(partida, arbol);
    const disponibles = new Set(
      arbol.conexiones.flatMap(([origen, destino]) =>
        completadas.has(origen) ? [destino] : [],
      ),
    );

    contenedorNodos
      .querySelectorAll("[data-investigacion]")
      .forEach((boton) => {
        const nodo = arbol.nodos.find(
          ({ id }) => id === boton.dataset.investigacion,
        );
        const investigado = completadas.has(nodo.id);
        const conectado = disponibles.has(nodo.id);
        const puntosCiencia = Number(partida.ciencia ?? 0);

        boton.classList.toggle("investigacion-completada", investigado);
        boton.classList.toggle(
          "investigacion-disponible",
          !investigado && conectado && puntosCiencia >= nodo.costo,
        );
        boton.classList.toggle(
          "investigacion-insuficiente",
          !investigado && conectado && puntosCiencia < nodo.costo,
        );
        boton.classList.toggle(
          "investigacion-bloqueada",
          !investigado && !conectado,
        );
        boton.title = investigado
          ? "Investigación completada"
          : conectado
            ? `Desbloquear por ${nodo.costo} puntos de investigación`
            : "Completa una investigación conectada para desbloquear este nodo";
      });
  }

  function mostrarCategoria(categoria) {
    const arbol = ARBOLES_INVESTIGACION[categoria];
    if (!arbol) {
      throw new Error(`La categoría de investigación "${categoria}" no existe.`);
    }

    categoriaActual = categoria;
    guardarCategoriaInvestigacion(categoria);
    botonesCategoria.forEach((boton) => {
      if (boton.dataset.investigacionCategoria === categoria) {
        boton.setAttribute("aria-current", "page");
      } else {
        boton.removeAttribute("aria-current");
      }
    });

    renderizarArbol(arbol, contenedorNodos, contenedorConexiones);
    mensaje.textContent = "Selecciona un nodo conectado para investigar.";
    actualizarNodos();
  }

  botonesCategoria.forEach((boton) => {
    boton.onclick = () =>
      mostrarCategoria(boton.dataset.investigacionCategoria);
  });

  contenedorNodos.onclick = (evento) => {
    const objetivo = evento.target instanceof Element ? evento.target : null;
    const boton = objetivo?.closest("[data-investigacion]");
    if (!boton || !contenedorNodos.contains(boton)) return;

    const arbol = obtenerArbolActual();
    const nodo = arbol.nodos.find(
      ({ id }) => id === boton.dataset.investigacion,
    );
    const partida = obtenerPartida();
    const completadas = obtenerCompletadas(partida, arbol);

    if (completadas.has(nodo.id)) {
      mensaje.textContent = `${nodo.label} ya está completada.`;
      return;
    }

    const conectado = arbol.conexiones.some(
      ([origen, destino]) =>
        destino === nodo.id && completadas.has(origen),
    );
    if (!conectado) {
      mensaje.textContent =
        "Completa una investigación conectada para desbloquear este nodo.";
      return;
    }

    const puntosCiencia = Number(partida.ciencia ?? 0);
    if (puntosCiencia < nodo.costo) {
      mensaje.textContent = `Necesitas ${nodo.costo} puntos de investigación para desbloquear ${nodo.label}.`;
      return;
    }

    const partidaActualizada = gameState.actualizarSlotActual({
      ciencia: puntosCiencia - nodo.costo,
      investigacionesCompletadas: [...completadas, nodo.id],
    });
    if (!partidaActualizada) {
      throw new Error(`No se pudo completar la investigación "${nodo.label}".`);
    }

    const fragmentosNuevos = desbloquearInformacionPorHito(nodo.id);
    mensaje.textContent = `${nodo.label} completada.`;
    actualizarNodos();
    onResourcesChanged();
    fragmentosNuevos.forEach((fragmento) => {
      tutorialUnaVez(`informacion-${fragmento.id}`, {
        pasos: [
          {
            texto: "¡Desbloqueaste un nuevo fragmento de información!",
            expresion: "saludo",
          },
          {
            texto: `Al completar "${nodo.label}" descubriste información sobre ${fragmento.titulo}.`,
            resaltar: () => document.getElementById("btn-informacion"),
          },
          "Tocá Información para abrir tu archivo y leer el fragmento.",
        ],
        objetivo: () => document.getElementById("btn-informacion"),
      });
    });
  };

  mostrarCategoria(categoriaInicial);
  tutorialCuandoSeVea(
    "investigacion-intro",
    document.querySelector('[data-juego-panel="investigacion"]'),
    {
      pasos: [
        {
          texto:
            "¡Bienvenido al árbol de investigación! Las tecnologías que desarrolles habilitan nuevos componentes para el Taller.",
          expresion: "saludo",
        },
        {
          texto:
            "Usa estas categorías para explorar propulsión, combustible, control, carga útil y estructura.",
          resaltar: () => document.querySelector(".investigacion-categorias"),
        },
        {
          texto:
            "Cada mapa muestra tecnologías y sus conexiones. Solo puedes investigar una tecnología conectada a otra que ya completaste.",
          resaltar: () => document.getElementById("nodos-investigacion"),
        },
        {
          texto:
            "Los nodos indican su costo y estado. Necesitas suficientes puntos de investigación para desbloquearlos.",
          resaltar: () =>
            document.querySelector(
              "#nodos-investigacion .investigacion-nodo:not(.investigacion-completada)",
            ) ?? document.querySelector("#nodos-investigacion .investigacion-nodo"),
        },
        {
          texto:
            "Si te faltan puntos, pasa el mes para recibir ciencia. Al completar una tecnología, su componente correspondiente queda disponible en el Taller.",
          expresion: "pensando",
          resaltar: () => document.getElementById("juego-ciencia"),
        },
        "El mensaje debajo del árbol te explica si una investigación se completó o qué requisito te falta.",
      ],
    },
  );
  return actualizarNodos;
}
