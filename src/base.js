import { completarMision } from './mapa.js';
const $ = (id) => document.getElementById(id);
const MISIONES = {
  tierra: {
    titulo: 'Misión 1: Preparar el despegue',
    descripcion: 'Acá va la descripción de la misión. Editá este texto.',
  },
};
const MISION_POR_DEFECTO = { titulo: 'Misión', descripcion: 'Sin información todavía.' };
const VALORES_INICIALES = { dia: 1, presupuesto: 1000, puntosCiencia: 0 };
const MENSAJE_INICIAL = 'Bienvenido a la base. Elegí una opción del menú.';
let canvas, ctx;
let rafId = null;
let ultimoTiempo = 0;
let tiempo = 0;
let estrellas = [];
let particulas = [];
let nodoBase = null;
let datos = {};
let cb = {};
const VEL_CAPA = [0.02, 0.05, 0.1]; 
export function iniciarBase({ canvas: canvasEl, nodo, partida, onGuardar, onOpciones, onVolver }) {
  detenerBase();
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  nodoBase = nodo;
  datos = { ...VALORES_INICIALES, ...partida };
  cb = { onGuardar, onOpciones, onVolver };
  crearEstrellas();
  particulas = [];
  tiempo = 0;
  conectarBotones();
  pintarPanel();
  mostrarMensaje(MENSAJE_INICIAL);
  document.activeElement?.blur();
  ultimoTiempo = performance.now();
  rafId = requestAnimationFrame(bucle);
}
export function detenerBase() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
}
function conectarBotones() {
  $('base-btn-taller').onclick = () => mostrarMensaje('Taller: próximamente.');
  $('base-btn-arbol').onclick = () => mostrarMensaje('Árbol: próximamente.');
  $('base-btn-opciones').onclick = () => cb.onOpciones();
  $('base-btn-volver').onclick = () => cb.onVolver();
  $('base-btn-mision').onclick = () => {
    datos = completarMision(datos, nodoBase.id);
    cb.onGuardar({ completados: datos.completados, desbloqueados: datos.desbloqueados });
    pintarMision();
    mostrarMensaje('Misión completada. Se desbloquearon nuevos destinos en el mapa.');
  };
}
function pintarPanel() {
  $('base-dia').textContent = datos.dia;
  $('base-presupuesto-valor').textContent = Number(datos.presupuesto).toLocaleString('es-AR');
  $('base-ciencia-valor').textContent = datos.puntosCiencia;
  pintarMision();
}
function pintarMision() {
  const m = MISIONES[nodoBase.id] ?? MISION_POR_DEFECTO;
  const completada = (datos.completados ?? []).includes(nodoBase.id);
  $('base-mision-titulo').textContent = m.titulo;
  $('base-mision-descripcion').textContent = m.descripcion;
  $('base-mision-estado').textContent = completada ? 'Estado: completada' : 'Estado: pendiente';
  $('base-btn-mision').disabled = completada;
}
function mostrarMensaje(texto) {
  $('base-mensaje').textContent = texto;
}
function bucle(ahora) {
  const dt = Math.min((ahora - ultimoTiempo) / 1000, 0.05);
  ultimoTiempo = ahora;
  tiempo += dt;
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  const w = canvas.width;
  const h = canvas.height;
  if (w > 0 && h > 0) {
    const nave = calcularNave(w, h);
    actualizar(dt, nave);
    dibujar(w, h, nave);
  }
  rafId = requestAnimationFrame(bucle);
}
function crearEstrellas() {
  estrellas = Array.from({ length: 130 }, () => {
    const capa = Math.floor(Math.random() * 3);
    return { x: Math.random(), y: Math.random(), capa, r: 0.6 + capa * 0.5 };
  });
}
function calcularNave(w, h) {
  const s = Math.min(w, h) / 520;
  const intro = Math.min(tiempo / 1.6, 1);
  const suave = 1 - Math.pow(1 - intro, 3); 
  return {
    s,
    x: w / 2,
    y: h * 0.46 + (1 - suave) * h * 0.55 + Math.sin(tiempo * 1.3) * 8 * s,
    giro: Math.sin(tiempo * 0.9) * 0.035,
    potencia: 1 + (1 - suave) * 0.8, 
  };
}
function actualizar(dt, nave) {
  for (const e of estrellas) {
    e.y += VEL_CAPA[e.capa] * dt;
    if (e.y > 1) {
      e.y = 0;
      e.x = Math.random();
    }
  }
  const d = 84 * nave.s;
  const boquillaX = nave.x - d * Math.sin(nave.giro);
  const boquillaY = nave.y + d * Math.cos(nave.giro);
  const cantidad = Math.round(2 * nave.potencia);
  for (let i = 0; i < cantidad; i++) {
    particulas.push({
      x: boquillaX + (Math.random() - 0.5) * 10 * nave.s,
      y: boquillaY,
      vx: (Math.random() - 0.5) * 40 * nave.s,
      vy: (120 + Math.random() * 120) * nave.s,
      vida: 0,
      dur: 0.5 + Math.random() * 0.5,
      r: (3 + Math.random() * 4) * nave.s,
    });
  }
  for (const p of particulas) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vida += dt;
  }
  particulas = particulas.filter((p) => p.vida < p.dur);
}
function dibujar(w, h, nave) {
  ctx.fillStyle = '#05060f';
  ctx.fillRect(0, 0, w, h);
  dibujarEstrellas(w, h);
  dibujarTierra(w, h);
  dibujarParticulas();
  dibujarNave(nave);
}
function dibujarEstrellas(w, h) {
  const alfa = [0.35, 0.6, 0.95];
  for (const e of estrellas) {
    ctx.globalAlpha = alfa[e.capa];
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(e.x * w, e.y * h, e.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function dibujarTierra(w, h) {
  const r = w * 0.8;
  const cx = w / 2;
  const cy = h + r * 0.7;
  const brillo = ctx.createRadialGradient(cx, cy, r * 0.97, cx, cy, r * 1.1);
  brillo.addColorStop(0, 'rgba(80, 160, 255, 0.55)');
  brillo.addColorStop(1, 'rgba(80, 160, 255, 0)');
  ctx.fillStyle = brillo;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
  ctx.fill();
  const planeta = ctx.createRadialGradient(cx, cy - r * 0.3, r * 0.2, cx, cy, r);
  planeta.addColorStop(0, '#2a6fb8');
  planeta.addColorStop(1, '#0b2a52');
  ctx.fillStyle = planeta;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}
function dibujarParticulas() {
  for (const p of particulas) {
    const t = p.vida / p.dur;
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = t < 0.4 ? '#ffb030' : '#8a8f9c';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (1 - t * 0.5), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function dibujarNave(nave) {
  ctx.save();
  ctx.translate(nave.x, nave.y);
  ctx.rotate(nave.giro);
  ctx.scale(nave.s, nave.s);
  const parpadeo = Math.sin(tiempo * 37) * 5 + Math.sin(tiempo * 23) * 4;
  const largo = (46 + parpadeo) * nave.potencia;
  const llama = ctx.createLinearGradient(0, 84, 0, 84 + largo);
  llama.addColorStop(0, '#fff6b0');
  llama.addColorStop(0.4, '#ffb030');
  llama.addColorStop(1, 'rgba(255, 80, 0, 0)');
  ctx.fillStyle = llama;
  ctx.beginPath();
  ctx.moveTo(-13, 84);
  ctx.quadraticCurveTo(0, 84 + largo * 1.3, 13, 84);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.moveTo(-6, 84);
  ctx.quadraticCurveTo(0, 84 + largo * 0.7, 6, 84);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9aa7b8';
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.lineTo(90, 90);
  ctx.lineTo(30, 72);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(-90, 90);
  ctx.lineTo(-30, 72);
  ctx.closePath();
  ctx.fill();
  const encendida = Math.sin(tiempo * 6) > 0;
  ctx.fillStyle = encendida ? '#ff4040' : '#551111';
  ctx.beginPath();
  ctx.arc(-90, 90, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = encendida ? '#40ff70' : '#115522';
  ctx.beginPath();
  ctx.arc(90, 90, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#556070';
  ctx.fillRect(-15, 70, 30, 14);
  const cuerpo = ctx.createLinearGradient(-32, 0, 32, 0);
  cuerpo.addColorStop(0, '#aab4c2');
  cuerpo.addColorStop(0.5, '#ffffff');
  cuerpo.addColorStop(1, '#8d98a8');
  ctx.fillStyle = cuerpo;
  ctx.beginPath();
  ctx.moveTo(0, -125);
  ctx.quadraticCurveTo(38, -60, 32, 20);
  ctx.lineTo(32, 72);
  ctx.lineTo(-32, 72);
  ctx.lineTo(-32, 20);
  ctx.quadraticCurveTo(-38, -60, 0, -125);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d33';
  ctx.fillRect(-32, 30, 64, 10);
  ctx.fillStyle = '#4fd0ff';
  ctx.beginPath();
  ctx.ellipse(0, -45, 12, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.ellipse(-4, -52, 4, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}