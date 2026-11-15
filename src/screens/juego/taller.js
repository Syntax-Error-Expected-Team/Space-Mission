import gameState from "../../game-state.js";

const COMPONENTES = [
  {
    id: "punta",
    nombre: "Punta",
    icono: "change_history",
    precio: 100,
    masa: 50,
    material: "Aleación de aluminio",
    descripcion: "Protege la parte superior y mejora la aerodinámica.",
  },
  {
    id: "cabina",
    nombre: "Cabina",
    icono: "airline_seat_recline_extra",
    precio: 200,
    masa: 200,
    material: "Aluminio reforzado",
    descripcion: "Aloja a la tripulación y los sistemas de control.",
  },
  {
    id: "tanque",
    nombre: "Tanque de combustible",
    icono: "propane_tank",
    precio: 250,
    masa: 500,
    material: "Acero especial",
    descripcion: "Almacena el combustible para impulsar el vehículo.",
  },
  {
    id: "alas",
    nombre: "Estabilizadores",
    icono: "flight",
    precio: 100,
    masa: 80,
    material: "Fibra de carbono",
    descripcion: "Ayudan a mantener la estabilidad durante el vuelo.",
  },
  {
    id: "motor",
    nombre: "Motor",
    icono: "rocket_launch",
    precio: 350,
    masa: 300,
    material: "Aleación resistente al calor",
    descripcion: "Genera el empuje necesario para el despegue.",
  },
];

const HERRAMIENTAS = [
  {
    id: "taladro",
    nombre: "Taladro",
    icono: "hardware",
    precio: 70,
    masa: 2,
    material: "Acero",
    descripcion: "Perfora y prepara las superficies de montaje.",
  },
  {
    id: "martillo",
    nombre: "Martillo",
    icono: "construction",
    precio: 40,
    masa: 1,
    material: "Hierro",
    descripcion: "Ajusta y fija los componentes.",
  },
  {
    id: "llave",
    nombre: "Llave",
    icono: "build",
    precio: 50,
    masa: 0.5,
    material: "Metal",
    descripcion: "Ajusta tuercas y conexiones.",
  },
  {
    id: "linterna",
    nombre: "Linterna",
    icono: "flashlight_on",
    precio: 30,
    masa: 0.8,
    material: "Plástico",
    descripcion: "Ilumina las zonas de trabajo.",
  },
];

const COMPONENTES_POR_ID = new Map(
  COMPONENTES.map((componente) => [componente.id, componente]),
);
const HERRAMIENTAS_POR_ID = new Map(
  HERRAMIENTAS.map((herramienta) => [herramienta.id, herramienta]),
);

function normalizarIds(ids, catalogo) {
  if (!Array.isArray(ids)) return [];
  return [...new Set(ids.filter((id) => catalogo.has(id)))];
}

function formatearMasa(masa) {
  return `${masa.toLocaleString("es-AR", { maximumFractionDigits: 2 })} kg`;
}

function obtenerTaller(partida) {
  return {
    partesInstaladas: normalizarIds(
      partida.taller?.partesInstaladas,
      COMPONENTES_POR_ID,
    ),
    herramientasCargadas: normalizarIds(
      partida.taller?.herramientasCargadas,
      HERRAMIENTAS_POR_ID,
    ),
  };
}

export default function inicializarTaller({ onResourcesChanged } = {}) {
  const inventarioPartes = document.getElementById("taller-partes");
  const inventarioHerramientas = document.getElementById(
    "taller-herramientas",
  );
  const cohete = document.getElementById("taller-cohete");
  const cargaZona = document.getElementById("taller-carga");
  const cargaLista = document.getElementById("taller-carga-lista");
  const cargaVacia = document.getElementById("taller-carga-vacia");
  const presupuesto = document.getElementById("taller-presupuesto");
  const totalCohete = document.getElementById("taller-total-cohete");
  const masaCohete = document.getElementById("taller-masa-cohete");
  const progresoBarra = document.querySelector(".taller-barra");
  const progreso = document.getElementById("taller-progreso");
  const progresoTexto = document.getElementById("taller-progreso-texto");
  const gastos = document.getElementById("taller-gastos");
  const estadoMision = document.getElementById("taller-estado-mision");
  const aviso = document.getElementById("taller-aviso");
  const btnVerificar = document.getElementById("taller-verificar");
  const btnDesmontar = document.getElementById("taller-desmontar");

  if (
    !inventarioPartes ||
    !inventarioHerramientas ||
    !cohete ||
    !cargaZona ||
    !cargaLista ||
    !cargaVacia ||
    !presupuesto ||
    !totalCohete ||
    !masaCohete ||
    !progresoBarra ||
    !progreso ||
    !progresoTexto ||
    !gastos ||
    !estadoMision ||
    !aviso ||
    !btnVerificar ||
    !btnDesmontar
  ) {
    throw new Error("No se encontraron los elementos del taller.");
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

  function crearElementoInventario(elemento, tipo, ocupado) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "taller-pieza";
    boton.draggable = !ocupado;
    boton.dataset.tallerItem = elemento.id;
    boton.dataset.tallerTipo = tipo;
    boton.setAttribute("aria-pressed", "false");
    boton.setAttribute(
      "aria-label",
      `${elemento.nombre}, $${elemento.precio}, masa ${formatearMasa(elemento.masa)}. ${elemento.descripcion}`,
    );
    if (ocupado) {
      boton.classList.add("taller-pieza-ocupada");
      boton.disabled = true;
    }

    const icono = document.createElement("span");
    icono.className = "taller-pieza-icono material-symbols-outlined";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = elemento.icono;

    const detalles = document.createElement("span");
    detalles.className = "taller-pieza-detalles";

    const nombre = document.createElement("strong");
    nombre.textContent = elemento.nombre;

    const costo = document.createElement("small");
    costo.textContent = `$${elemento.precio.toLocaleString("es-AR")} · ${formatearMasa(elemento.masa)}`;

    detalles.append(nombre, costo);
    boton.append(icono, detalles);
    return boton;
  }

  function renderizarInventarios(taller) {
    inventarioPartes.replaceChildren(
      ...COMPONENTES.map((componente) =>
        crearElementoInventario(
          componente,
          "parte",
          taller.partesInstaladas.includes(componente.id),
        ),
      ),
    );
    inventarioHerramientas.replaceChildren(
      ...HERRAMIENTAS.map((herramienta) =>
        crearElementoInventario(
          herramienta,
          "herramienta",
          taller.herramientasCargadas.includes(herramienta.id),
        ),
      ),
    );

    if (elementoSeleccionado) {
      document
        .querySelectorAll("[data-taller-item]")
        .forEach((boton) => {
          const seleccionado =
            boton.dataset.tallerItem === elementoSeleccionado.id &&
            boton.dataset.tallerTipo === elementoSeleccionado.tipo;
          boton.classList.toggle("taller-pieza-seleccionada", seleccionado);
          boton.setAttribute("aria-pressed", String(seleccionado));
        });
    }
  }

  function renderizarCohete(taller) {
    cohete
      .querySelectorAll("[data-zona-parte]")
      .forEach((zona) => {
        const idParte = zona.dataset.zonaParte;
        const parte = COMPONENTES_POR_ID.get(idParte);
        const instalada = taller.partesInstaladas.includes(idParte);
        const icono = zona.querySelector(".taller-zona-icono");
        const etiqueta = zona.querySelector("span:last-child");
        const btnDesmontar = cohete.querySelector(
          `[data-quitar-parte="${idParte}"]`,
        );

        zona.classList.toggle("taller-zona-instalada", instalada);
        icono.textContent = instalada ? parte.icono : icono.dataset.icono;
        etiqueta.textContent = instalada ? parte.nombre : zona.dataset.etiqueta;
        zona.setAttribute(
          "aria-label",
          instalada
            ? `${parte.nombre} instalado.`
            : `Posición para ${parte.nombre}. Selecciona o arrastra el componente.`,
        );
        btnDesmontar.hidden = !instalada;
      });
  }

  function renderizarCarga(taller) {
    const herramientas = taller.herramientasCargadas
      .map((id) => HERRAMIENTAS_POR_ID.get(id))
      .filter(Boolean);

    cargaVacia.hidden = herramientas.length > 0;
    cargaLista.replaceChildren(
      ...herramientas.map((herramienta) => {
        const item = document.createElement("div");
        item.className = "taller-herramienta-cargada";

        const etiqueta = document.createElement("span");
        etiqueta.className = "taller-herramienta-cargada-etiqueta";
        const icono = document.createElement("span");
        icono.className = "material-symbols-outlined";
        icono.setAttribute("aria-hidden", "true");
        icono.textContent = herramienta.icono;
        const nombre = document.createElement("span");
        nombre.textContent = herramienta.nombre;
        etiqueta.append(icono, nombre);

        const botonQuitar = document.createElement("button");
        botonQuitar.type = "button";
        botonQuitar.dataset.quitarHerramienta = herramienta.id;
        botonQuitar.setAttribute(
          "aria-label",
          `Quitar ${herramienta.nombre} de la carga y devolver su costo`,
        );
        botonQuitar.textContent = "×";

        item.append(etiqueta, botonQuitar);
        return item;
      }),
    );
  }

  function renderizarResumen(taller, partida) {
    const totalPartes = taller.partesInstaladas.reduce(
      (total, id) => total + COMPONENTES_POR_ID.get(id).precio,
      0,
    );
    const totalHerramientas = taller.herramientasCargadas.reduce(
      (total, id) => total + HERRAMIENTAS_POR_ID.get(id).precio,
      0,
    );
    const totalGastado = totalPartes + totalHerramientas;
    const masaTotalCohete = taller.partesInstaladas.reduce(
      (total, id) => total + COMPONENTES_POR_ID.get(id).masa,
      0,
    );
    const fondos = Number(partida.presupuesto ?? 0);

    presupuesto.textContent = `$${fondos.toLocaleString("es-AR")}`;
    totalCohete.textContent = `$${totalGastado.toLocaleString("es-AR")}`;
    masaCohete.textContent = formatearMasa(masaTotalCohete);
    progresoTexto.textContent = `${taller.partesInstaladas.length} / ${COMPONENTES.length} componentes instalados`;
    progreso.style.width = `${(taller.partesInstaladas.length / COMPONENTES.length) * 100}%`;
    progresoBarra.setAttribute(
      "aria-valuenow",
      String(taller.partesInstaladas.length),
    );

    const registros = [
      ...taller.partesInstaladas.map((id) => ({
        nombre: COMPONENTES_POR_ID.get(id).nombre,
        precio: COMPONENTES_POR_ID.get(id).precio,
      })),
      ...taller.herramientasCargadas.map((id) => ({
        nombre: HERRAMIENTAS_POR_ID.get(id).nombre,
        precio: HERRAMIENTAS_POR_ID.get(id).precio,
      })),
    ];
    gastos.replaceChildren();

    if (registros.length === 0) {
      const vacio = document.createElement("li");
      vacio.textContent = "Todavía no hay gastos.";
      gastos.append(vacio);
    } else {
      registros.forEach(({ nombre, precio }) => {
        const registro = document.createElement("li");
        registro.textContent = `${nombre}: $${precio.toLocaleString("es-AR")}`;
        gastos.append(registro);
      });
    }

    if (taller.partesInstaladas.length === COMPONENTES.length) {
      estadoMision.textContent =
        `Vehículo completo. ${taller.herramientasCargadas.length} herramientas listas para la misión.`;
    } else {
      estadoMision.textContent =
        `Montaje en progreso: ${taller.partesInstaladas.length} de ${COMPONENTES.length} componentes instalados.`;
    }
  }

  function actualizarTaller() {
    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    renderizarInventarios(taller);
    renderizarCohete(taller);
    renderizarCarga(taller);
    renderizarResumen(taller, partida);
  }

  function comprarComponente(id, zonaId) {
    const componente = COMPONENTES_POR_ID.get(id);
    if (!componente) {
      mostrarAviso("Componente no válido.");
      return;
    }
    if (zonaId !== componente.id) {
      mostrarAviso("Ese componente no corresponde a esta posición.");
      return;
    }

    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    if (taller.partesInstaladas.includes(id)) {
      mostrarAviso(`${componente.nombre} ya está instalado.`);
      return;
    }

    const fondos = Number(partida.presupuesto ?? 0);
    if (fondos < componente.precio) {
      mostrarAviso(`Fondos insuficientes para instalar ${componente.nombre}.`);
      return;
    }

    const partidaActualizada = guardarCambios({
      presupuesto: fondos - componente.precio,
      taller: {
        ...taller,
        partesInstaladas: [...taller.partesInstaladas, id],
      },
    });
    elementoSeleccionado = null;
    actualizarTaller();
    mostrarAviso(`${componente.nombre} instalado.`);
    return partidaActualizada;
  }

  function comprarHerramienta(id) {
    const herramienta = HERRAMIENTAS_POR_ID.get(id);
    if (!herramienta) {
      mostrarAviso("Herramienta no válida.");
      return;
    }

    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    if (taller.herramientasCargadas.includes(id)) {
      mostrarAviso(`${herramienta.nombre} ya está en la carga.`);
      return;
    }

    const fondos = Number(partida.presupuesto ?? 0);
    if (fondos < herramienta.precio) {
      mostrarAviso(`Fondos insuficientes para cargar ${herramienta.nombre}.`);
      return;
    }

    guardarCambios({
      presupuesto: fondos - herramienta.precio,
      taller: {
        ...taller,
        herramientasCargadas: [...taller.herramientasCargadas, id],
      },
    });
    elementoSeleccionado = null;
    actualizarTaller();
    mostrarAviso(`${herramienta.nombre} agregada a la carga.`);
  }

  function quitarComponente(id) {
    const componente = COMPONENTES_POR_ID.get(id);
    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    if (!componente || !taller.partesInstaladas.includes(id)) return;

    guardarCambios({
      presupuesto: Number(partida.presupuesto ?? 0) + componente.precio,
      taller: {
        ...taller,
        partesInstaladas: taller.partesInstaladas.filter(
          (parteId) => parteId !== id,
        ),
      },
    });
    actualizarTaller();
    mostrarAviso(`${componente.nombre} desmontado; se devolvió su costo.`);
  }

  function quitarHerramienta(id) {
    const herramienta = HERRAMIENTAS_POR_ID.get(id);
    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    if (!herramienta || !taller.herramientasCargadas.includes(id)) return;

    guardarCambios({
      presupuesto: Number(partida.presupuesto ?? 0) + herramienta.precio,
      taller: {
        ...taller,
        herramientasCargadas: taller.herramientasCargadas.filter(
          (herramientaId) => herramientaId !== id,
        ),
      },
    });
    actualizarTaller();
    mostrarAviso(`${herramienta.nombre} retirada; se devolvió su costo.`);
  }

  function obtenerElementoArrastrado(evento) {
    const id = evento.dataTransfer?.getData("text/plain");
    const tipo = evento.dataTransfer?.getData("application/x-taller-tipo");
    if (!id || (tipo !== "parte" && tipo !== "herramienta")) return null;
    return { id, tipo };
  }

  [inventarioPartes, inventarioHerramientas].forEach((inventario) => {
    inventario.onclick = (evento) => {
      const boton = evento.target.closest("[data-taller-item]");
      if (!boton || boton.disabled) return;

      const id = boton.dataset.tallerItem;
      const tipo = boton.dataset.tallerTipo;
      elementoSeleccionado =
        elementoSeleccionado?.id === id && elementoSeleccionado?.tipo === tipo
          ? null
          : { id, tipo };
      actualizarTaller();
      mostrarAviso(
        elementoSeleccionado
          ? `Seleccionado: ${boton.querySelector("strong").textContent}. Elige una posición de montaje o la carga.`
          : "Selección cancelada.",
      );
    };

    inventario.ondragstart = (evento) => {
      const boton = evento.target.closest("[data-taller-item]");
      if (!boton || boton.disabled || !evento.dataTransfer) return;
      evento.dataTransfer.effectAllowed = "move";
      evento.dataTransfer.setData("text/plain", boton.dataset.tallerItem);
      evento.dataTransfer.setData(
        "application/x-taller-tipo",
        boton.dataset.tallerTipo,
      );
    };
  });

  cohete.onclick = (evento) => {
    const botonDesmontar = evento.target.closest("[data-quitar-parte]");
    if (botonDesmontar) {
      quitarComponente(botonDesmontar.dataset.quitarParte);
      return;
    }

    const zona = evento.target.closest("[data-zona-parte]");
    if (
      zona &&
      elementoSeleccionado?.tipo === "parte"
    ) {
      comprarComponente(elementoSeleccionado.id, zona.dataset.zonaParte);
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
      const elemento = obtenerElementoArrastrado(evento);
      if (elemento?.tipo !== "parte") {
        mostrarAviso("Arrastra un componente a su posición.");
        return;
      }
      comprarComponente(elemento.id, zona.dataset.zonaParte);
    };
  });

  cargaZona.onclick = (evento) => {
    if (evento.target.closest("[data-quitar-herramienta]")) return;
    if (elementoSeleccionado?.tipo === "herramienta") {
      comprarHerramienta(elementoSeleccionado.id);
    }
  };
  cargaZona.onkeydown = (evento) => {
    if (
      evento.target === cargaZona &&
      (evento.key === "Enter" || evento.key === " ")
    ) {
      evento.preventDefault();
      if (elementoSeleccionado?.tipo === "herramienta") {
        comprarHerramienta(elementoSeleccionado.id);
      }
    }
  };
  cargaZona.ondragover = (evento) => {
    evento.preventDefault();
    cargaZona.classList.add("taller-carga-hover");
  };
  cargaZona.ondragleave = () =>
    cargaZona.classList.remove("taller-carga-hover");
  cargaZona.ondrop = (evento) => {
    evento.preventDefault();
    cargaZona.classList.remove("taller-carga-hover");
    const elemento = obtenerElementoArrastrado(evento);
    if (elemento?.tipo !== "herramienta") {
      mostrarAviso("Arrastra una herramienta a la carga de misión.");
      return;
    }
    comprarHerramienta(elemento.id);
  };

  cargaLista.onclick = (evento) => {
    const boton = evento.target.closest("[data-quitar-herramienta]");
    if (boton) quitarHerramienta(boton.dataset.quitarHerramienta);
  };

  btnVerificar.onclick = () => {
    const taller = obtenerTaller(obtenerPartida());
    const faltantes = COMPONENTES.filter(
      ({ id }) => !taller.partesInstaladas.includes(id),
    );
    if (faltantes.length > 0) {
      const nombres = faltantes.map(({ nombre }) => nombre).join(", ");
      estadoMision.textContent = `Faltan componentes: ${nombres}.`;
      mostrarAviso("El montaje todavía está incompleto.");
      return;
    }

    estadoMision.textContent =
      `Vehículo completo con ${taller.herramientasCargadas.length} herramientas cargadas.`;
    mostrarAviso("Vehículo verificado y listo para la misión.");
  };

  btnDesmontar.onclick = () => {
    const partida = obtenerPartida();
    const taller = obtenerTaller(partida);
    const totalReembolsable = [
      ...taller.partesInstaladas.map((id) => COMPONENTES_POR_ID.get(id).precio),
      ...taller.herramientasCargadas.map(
        (id) => HERRAMIENTAS_POR_ID.get(id).precio,
      ),
    ].reduce((total, precio) => total + precio, 0);

    if (totalReembolsable === 0) {
      mostrarAviso("No hay componentes ni herramientas que desmontar.");
      return;
    }
    if (!confirm("¿Desmontar el vehículo y devolver el costo de sus piezas?")) {
      return;
    }

    guardarCambios({
      presupuesto: Number(partida.presupuesto ?? 0) + totalReembolsable,
      taller: { partesInstaladas: [], herramientasCargadas: [] },
    });
    elementoSeleccionado = null;
    actualizarTaller();
    mostrarAviso("Montaje desmontado. Se devolvieron los fondos utilizados.");
  };

  actualizarTaller();
  return actualizarTaller;
}
