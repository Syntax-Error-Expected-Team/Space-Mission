import { iniciarMapa, detenerMapa } from './mapa.js';
const $ = (id) => document.getElementById(id);
const TOTAL_SLOTS = 3;
const CLAVE_OPCIONES = 'spaceMission:opciones';
const claveSlot = (n) => `spaceMission:partida:${n}`;
const pantallas = {
  menu: $('pantalla-menu'),
  campanas: $('pantalla-campanas'),
  juego: $('pantalla-juego'),
  salida: $('pantalla-salida'),
};
function mostrarPantalla(nombre) {
  for (const key in pantallas) {
    pantallas[key].hidden = key !== nombre;
  }
}
function abrirModal(id) {
  $(id).showModal();
}
document.querySelectorAll('[data-cerrar]').forEach((btn) => {
  btn.addEventListener('click', () => btn.closest('dialog').close());
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
  $('btn-continuar').disabled = !hayAlgunaPartida();
}
const opcionesPorDefecto = { musica: true, volumen: 50 };
function cargarOpciones() {
  try {
    return { ...opcionesPorDefecto, ...JSON.parse(localStorage.getItem(CLAVE_OPCIONES)) };
  } catch {
    return { ...opcionesPorDefecto };
  }
}
export const opciones = cargarOpciones();
function guardarOpciones() {
  localStorage.setItem(CLAVE_OPCIONES, JSON.stringify(opciones));
}
function pintarOpciones() {
  $('opt-musica').checked = opciones.musica;
  $('opt-volumen').value = opciones.volumen;
  $('opt-volumen-valor').textContent = opciones.volumen;
}
$('opt-musica').addEventListener('change', (e) => {
  opciones.musica = e.target.checked;
  guardarOpciones();
});
$('opt-volumen').addEventListener('input', (e) => {
  opciones.volumen = Number(e.target.value);
  $('opt-volumen-valor').textContent = opciones.volumen;
  guardarOpciones();
});
let modoCampanas = 'nueva'; 
export let slotActual = null;
function abrirCampanas(modo) {
  modoCampanas = modo;
  $('titulo-campanas').textContent =
    modo === 'nueva' ? 'Nueva campaña' : 'Continuar campaña';
  pintarCampanas();
  mostrarPantalla('campanas');
}
function pintarCampanas() {
  document.querySelectorAll('.campana').forEach((slotEl) => {
    const n = Number(slotEl.dataset.slot);
    const partida = cargarSlot(n);
    const btn = slotEl.querySelector('.campana-btn');
    const estado = slotEl.querySelector('.campana-estado');
    const borrar = slotEl.querySelector('.btn-borrar');
    borrar.hidden = !partida;
    if (modoCampanas === 'nueva') {
      estado.textContent = partida ? 'Ocupada: borrala para empezar de nuevo' : 'Vacía';
      btn.disabled = Boolean(partida);
    } else {
      estado.textContent = partida ? 'Partida guardada' : 'Vacía';
      btn.disabled = !partida;
    }
  });
}
document.querySelectorAll('.campana').forEach((slotEl) => {
  const n = Number(slotEl.dataset.slot);
  slotEl.querySelector('.campana-btn').addEventListener('click', () => {
    if (modoCampanas === 'nueva') {
      guardarPartida(n, { creada: Date.now() });
      iniciarJuego(n, null);
    } else {
      iniciarJuego(n, cargarSlot(n));
    }
  });
  slotEl.querySelector('.btn-borrar').addEventListener('click', () => {
    const ok = confirm(`¿Borrar la Campaña ${n}? No se puede deshacer.`);
    if (!ok) return;
    borrarSlot(n);
    actualizarBotonContinuar();
    pintarCampanas();
    if (modoCampanas === 'continuar' && !hayAlgunaPartida()) {
      mostrarPantalla('menu');
    }
  });
});
$('btn-campanas-volver').addEventListener('click', () => mostrarPantalla('menu'));
function iniciarJuego(slot, partida) {
  slotActual = slot;
  mostrarPantalla('juego');
  iniciarMapa($('game'), partida, (estado) => guardarPartida(slot, estado));
}

function detenerJuego() {
  detenerMapa();
}
$('btn-nueva-campana').addEventListener('click', () => abrirCampanas('nueva'));
$('btn-continuar').addEventListener('click', () => abrirCampanas('continuar'));

$('btn-opciones').addEventListener('click', () => {
  pintarOpciones();
  abrirModal('modal-opciones');
});
$('btn-salir').addEventListener('click', () => abrirModal('modal-salir'));
$('btn-info').addEventListener('click', () => abrirModal('modal-info'));
$('btn-creditos').addEventListener('click', () => abrirModal('modal-creditos'));
$('btn-salir-si').addEventListener('click', () => {
  $('modal-salir').close();
  window.close();
  mostrarPantalla('salida');
});
$('btn-volver-inicio').addEventListener('click', () => mostrarPantalla('menu'));
$('btn-volver-menu').addEventListener('click', () => {
  detenerJuego();
  mostrarPantalla('menu');
});
actualizarBotonContinuar();
mostrarPantalla('menu');