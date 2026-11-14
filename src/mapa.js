const NODOS = [
  { id: 'tierra',     nombre: 'Tierra',      x: 100, y: 300 },
  { id: 'luna',       nombre: 'Luna',        x: 260, y: 170 },
  { id: 'iss',        nombre: 'Estación',    x: 260, y: 430 },
  { id: 'marte',      nombre: 'Marte',       x: 450, y: 300 },
  { id: 'asteroides', nombre: 'Asteroides',  x: 620, y: 170 },
  { id: 'jupiter',    nombre: 'Júpiter',     x: 700, y: 330 },
  { id: 'europa',     nombre: 'Europa',      x: 580, y: 470 },
];
const CONEXIONES = [
  ['tierra', 'luna'],
  ['tierra', 'iss'],
  ['luna', 'marte'],
  ['iss', 'marte'],
  ['marte', 'asteroides'],
  ['asteroides', 'jupiter'],
  ['jupiter', 'europa'],
];
const NODO_INICIAL = 'tierra';
const VELOCIDAD = 250; 
const DIRECCIONES = {
  arrowup: [0, -1],    w: [0, -1],
  arrowdown: [0, 1],   s: [0, 1],
  arrowleft: [-1, 0],  a: [-1, 0],
  arrowright: [1, 0],  d: [1, 0],
};
const TECLAS_ACCION = ['enter', ' '];
const nodoPorId = Object.fromEntries(NODOS.map((n) => [n.id, n]));
const vecinos = Object.fromEntries(NODOS.map((n) => [n.id, []]));
CONEXIONES.forEach(([a, b]) => {
  vecinos[a].push(b);
  vecinos[b].push(a);
});
let canvas, ctx, alGuardar;
let rafId = null;
let ultimoTiempo = 0;
let estado; 
let viaje = null; 
let angulo = -Math.PI / 2;
let mensaje = '';
export function iniciarMapa(canvasEl, partida, guardarCb) {
  detenerMapa(); 
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  alGuardar = guardarCb;
  estado = {
    nodoActual: partida?.nodoActual ?? NODO_INICIAL,
    completados: partida?.completados ?? [],
    desbloqueados: partida?.desbloqueados ?? [NODO_INICIAL],
  };
  viaje = null;
  mensaje = '';
  document.activeElement?.blur();
  addEventListener('keydown', alTeclear);
  ultimoTiempo = performance.now();
  rafId = requestAnimationFrame(bucle);
}
export function detenerMapa() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
  removeEventListener('keydown', alTeclear);
}
function alTeclear(e) {
  const tecla = e.key.toLowerCase();
  if (DIRECCIONES[tecla]) {
    e.preventDefault();
    intentarMover(DIRECCIONES[tecla]);
  } else if (TECLAS_ACCION.includes(tecla)) {
    e.preventDefault();
    entrarMision();
  }
}
function intentarMover([dx, dy]) {
  if (viaje) return; 
  const actual = nodoPorId[estado.nodoActual];
  let mejor = null;
  let mejorPuntaje = 0.5; 
  for (const id of vecinos[actual.id]) {
    if (!estado.desbloqueados.includes(id)) continue;
    const v = nodoPorId[id];
    const largo = Math.hypot(v.x - actual.x, v.y - actual.y);
    const puntaje = ((v.x - actual.x) * dx + (v.y - actual.y) * dy) / largo;
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = id;
    }
  }
  if (mejor) {
    viaje = { desde: actual.id, hacia: mejor, t: 0 };
    mensaje = '';
  }
}
function entrarMision() {
  if (viaje) return;
  const nodo = nodoPorId[estado.nodoActual];
  if (estado.completados.includes(nodo.id)) {
    mensaje = `"${nodo.nombre}" ya está completada`;
    return;
  }
  estado.completados.push(nodo.id);
  vecinos[nodo.id].forEach((id) => {
    if (!estado.desbloqueados.includes(id)) estado.desbloqueados.push(id);
  });
  mensaje = `Misión "${nodo.nombre}" completada`;
  guardar();
}
function guardar() {
  alGuardar({ ...estado });
}
function bucle(ahora) {
  const dt = Math.min((ahora - ultimoTiempo) / 1000, 0.05);
  ultimoTiempo = ahora;
  actualizar(dt);
  dibujar();
  rafId = requestAnimationFrame(bucle);
}
function actualizar(dt) {
  if (!viaje) return;
  const a = nodoPorId[viaje.desde];
  const b = nodoPorId[viaje.hacia];
  const distancia = Math.hypot(b.x - a.x, b.y - a.y);
  viaje.t += (VELOCIDAD * dt) / distancia;
  angulo = Math.atan2(b.y - a.y, b.x - a.x);
  if (viaje.t >= 1) {
    estado.nodoActual = viaje.hacia;
    viaje = null;
    guardar();
  }
}
function posicionNave() {
  if (!viaje) {
    const n = nodoPorId[estado.nodoActual];
    return { x: n.x, y: n.y };
  }
  const a = nodoPorId[viaje.desde];
  const b = nodoPorId[viaje.hacia];
  return { x: a.x + (b.x - a.x) * viaje.t, y: a.y + (b.y - a.y) * viaje.t };
}
function dibujar() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  CONEXIONES.forEach(([ida, idb]) => {
    const a = nodoPorId[ida];
    const b = nodoPorId[idb];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  NODOS.forEach((n) => {
    const completado = estado.completados.includes(n.id);
    const desbloqueado = estado.desbloqueados.includes(n.id);
    ctx.fillStyle = completado ? '#4caf50' : desbloqueado ? '#ffffff' : '#444444';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = desbloqueado ? '#ffffff' : '#777777';
    ctx.fillText(n.nombre, n.x, n.y + 38);
  });
  const p = posicionNave();
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(angulo);
  ctx.fillStyle = 'cyan';
  ctx.beginPath();
  ctx.moveTo(16, 0);
  ctx.lineTo(-10, -9);
  ctx.lineTo(-10, 9);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('Flechas / WASD: mover   Enter: iniciar misión', 16, canvas.height - 16);
  if (mensaje) {
    ctx.textAlign = 'center';
    ctx.fillText(mensaje, canvas.width / 2, 32);
  }
}