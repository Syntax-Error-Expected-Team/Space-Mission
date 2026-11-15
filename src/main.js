import "./style.css";
import "material-symbols";

// Importar partials
import menuHtml from "./partials/menu.html?raw";
import slotsHtml from "./partials/slots.html?raw";
import misionHtml from "./partials/mision.html?raw";
import juegoHtml from "./partials/juego.html?raw";
import investigacionHtml from "./partials/investigacion.html?raw";
import tallerHtml from "./partials/taller.html?raw";

// Importar lógica y estado
import inicializarMenu from "./screens/menu.js";
import inicializarSlots from "./screens/slots.js";
import inicializarMision from "./screens/mision.js";
import abrirDialogoDinamico from "./screens/dialog.js";

document.getElementById("pantalla-menu").innerHTML = menuHtml;
document.getElementById("pantalla-slots").innerHTML = slotsHtml;
document.getElementById("pantalla-mision").innerHTML = misionHtml;
document.getElementById("pantalla-juego").innerHTML = juegoHtml;
document.getElementById("pantalla-investigacion").innerHTML = investigacionHtml;
document.getElementById("pantalla-taller").innerHTML = tallerHtml;

function mostrarPantalla(idPantalla) {
  const pantallas = document.querySelectorAll(".pantalla");
  pantallas.forEach((p) => {
    p.hidden = p.id !== idPantalla;
  });
}

inicializarMenu({
  onJugar: () => {
    mostrarPantalla("pantalla-slots");
    configurarSlots();
  },
  onOpciones: () => {
    abrirDialogoDinamico({
      titulo: "Opciones",
      contenido: "Las opciones de configuración estarán disponibles próximamente.",
    });
  },
  onInfo: () => {
    abrirDialogoDinamico({
      titulo: "Información",
      contenido: "Explora el espacio y completa las misiones de Space Mission.",
    });
  },
  onCreditos: () => {
    abrirDialogoDinamico({
      titulo: "Créditos",
      contenido: "Desarrollado por Syntax Error: Expected Team.",
    });
  },
});

function configurarSlots() {
  inicializarSlots({
    onSeleccionarSlot: (n) => {
      mostrarPantalla("pantalla-mision");
      configurarMision();
    },
    onVolver: () => {
      mostrarPantalla("pantalla-menu");
    },
  });
}

function configurarMision() {
  inicializarMision({
    onIniciarMision: (idNodo) => {
      console.log(`Iniciando misión en el nodo: ${idNodo}`);
      mostrarPantalla("pantalla-juego");
    },
    onVolver: () => {
      mostrarPantalla("pantalla-menu");
    },
  });
}

/*
const TOTAL_SLOTS = 3;
const CLAVE_OPCIONES = "spaceMission:opciones";
const claveSlot = (n) => `spaceMission:partida:${n}`;

const pantallas = {
  menu: document.getElementById("pantalla-menu"),
  campanas: document.getElementById("pantalla-campanas"),
  juego: document.getElementById("pantalla-juego"),
  base: document.getElementById("pantalla-base"),
  salida: document.getElementById("pantalla-salida"),
};

function mostrarPantalla(nombre) {
  for (const key in pantallas) {
    pantallas[key].hidden = key !== nombre;
  }
}

function abrirModal(id) {
  document.getElementById(id).showModal();
}

document.querySelectorAll("[data-cerrar]").forEach((btn) => {
  btn.addEventListener("click", () => btn.closest("dialog").close());
});

function cargarSlot(n) {
  try {
    return JSON.parse(localStorage.getItem(claveSlot(n)));
  } catch {
    return null;
  }
}

export function guardarPartida(n, estado) {
  localStorage.setItem(claveSlot(n), JSON.stringify(estado));
  actualizarBotonContinuar();
}

function borrarSlot(n) {
  localStorage.removeItem(claveSlot(n));
}

function hayAlgunaPartida() {
  for (let n = 1; n <= TOTAL_SLOTS; n++) {
    if (cargarSlot(n)) return true;
  }
  return false;
}

function actualizarBotonContinuar() {
  document.getElementById("btn-continuar").disabled = !hayAlgunaPartida();
}

const opcionesPorDefecto = { musica: true, volumen: 50 };

function cargarOpciones() {
  try {
    return {
      ...opcionesPorDefecto,
      ...JSON.parse(localStorage.getItem(CLAVE_OPCIONES)),
    };
  } catch {
    return { ...opcionesPorDefecto };
  }
}

export const opciones = cargarOpciones();

function guardarOpciones() {
  localStorage.setItem(CLAVE_OPCIONES, JSON.stringify(opciones));
}

function pintarOpciones() {
  document.getElementById("opt-musica").checked = opciones.musica;
  document.getElementById("opt-volumen").value = opciones.volumen;
  document.getElementById("opt-volumen-valor").textContent = opciones.volumen;
}

document.getElementById("opt-musica").addEventListener("change", (e) => {
  opciones.musica = e.target.checked;
  guardarOpciones();
});

document.getElementById("opt-volumen").addEventListener("input", (e) => {
  opciones.volumen = Number(e.target.value);
  document.getElementById("opt-volumen-valor").textContent = opciones.volumen;
  guardarOpciones();
});

let modoCampanas = "nueva";
export let slotActual = null;

function abrirCampanas(modo) {
  modoCampanas = modo;
  document.getElementById("titulo-campanas").textContent =
    modo === "nueva" ? "Nueva campaña" : "Continuar campaña";
  pintarCampanas();
  mostrarPantalla("campanas");
}

function pintarCampanas() {
  document.querySelectorAll(".campana").forEach((slotEl) => {
    const n = Number(slotEl.dataset.slot);
    const partida = cargarSlot(n);
    const btn = slotEl.querySelector(".campana-btn");
    const estado = slotEl.querySelector(".campana-estado");
    const borrar = slotEl.querySelector(".btn-borrar");

    borrar.hidden = !partida;
    if (modoCampanas === "nueva") {
      estado.textContent = partida
        ? "Ocupada: borrala para empezar de nuevo"
        : "Vacía";
      btn.disabled = Boolean(partida);
    } else {
      estado.textContent = partida ? "Partida guardada" : "Vacía";
      btn.disabled = !partida;
    }
  });
}

document.querySelectorAll(".campana").forEach((slotEl) => {
  const n = Number(slotEl.dataset.slot);

  slotEl.querySelector(".campana-btn").addEventListener("click", () => {
    if (modoCampanas === "nueva") {
      guardarPartida(n, { creada: Date.now() });
      iniciarJuego(n, null);
    } else {
      iniciarJuego(n, cargarSlot(n));
    }
  });

  slotEl.querySelector(".btn-borrar").addEventListener("click", () => {
    const ok = confirm(`¿Borrar la Campaña ${n}? No se puede deshacer.`);
    if (!ok) return;
    borrarSlot(n);
    actualizarBotonContinuar();
    pintarCampanas();
    if (modoCampanas === "continuar" && !hayAlgunaPartida()) {
      mostrarPantalla("menu");
    }
  });
});

document
  .getElementById("btn-campanas-volver")
  .addEventListener("click", () => mostrarPantalla("menu"));

function iniciarJuego(slot, partida) {
  console.log(slot, partida);
  slotActual = slot;
  detenerBase();
  mostrarPantalla("juego");
  iniciarMapa(
    document.getElementById("game"),
    partida,
    (estado) => guardarPartida(slot, { ...cargarSlot(slot), ...estado }),
    (nodo) => {
      if (nodo.id === "tierra") {
        abrirBase(nodo);
        return true;
      }
      return false;
    },
  );
}

function abrirBase(nodo) {
  detenerMapa();
  mostrarPantalla("base");
  iniciarBase({
    canvas: document.getElementById("canvas-base"),
    nodo,
    partida: cargarSlot(slotActual) ?? {},
    onGuardar: (cambios) =>
      guardarPartida(slotActual, { ...cargarSlot(slotActual), ...cambios }),
    onOpciones: () => {
      pintarOpciones();
      abrirModal("modal-opciones");
    },
    onVolver: () => iniciarJuego(slotActual, cargarSlot(slotActual)),
  });
}

function detenerJuego() {
  detenerMapa();
  detenerBase();
}

document
  .getElementById("btn-nueva-campana")
  .addEventListener("click", () => abrirCampanas("nueva"));
document
  .getElementById("btn-continuar")
  .addEventListener("click", () => abrirCampanas("continuar"));

document.getElementById("btn-opciones").addEventListener("click", () => {
  pintarOpciones();
  abrirModal("modal-opciones");
});
document
  .getElementById("btn-salir")
  .addEventListener("click", () => abrirModal("modal-salir"));
document
  .getElementById("btn-info")
  .addEventListener("click", () => abrirModal("modal-info"));
document
  .getElementById("btn-creditos")
  .addEventListener("click", () => abrirModal("modal-creditos"));

document.getElementById("btn-salir-si").addEventListener("click", () => {
  document.getElementById("modal-salir").close();
  window.close();
  mostrarPantalla("salida");
});

document
  .getElementById("btn-volver-inicio")
  .addEventListener("click", () => mostrarPantalla("menu"));
document.getElementById("btn-volver-menu").addEventListener("click", () => {
  detenerJuego();
  mostrarPantalla("menu");
});

actualizarBotonContinuar();
mostrarPantalla("menu");
*/
