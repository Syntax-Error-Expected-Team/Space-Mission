const NODOS = [
  { id: "tierra", nombre: "Tierra", x: 100, y: 300 },
  { id: "luna", nombre: "Luna", x: 260, y: 170 },
  { id: "iss", nombre: "Estación", x: 260, y: 430 },
  { id: "marte", nombre: "Marte", x: 450, y: 300 },
  { id: "asteroides", nombre: "Asteroides", x: 620, y: 170 },
  { id: "jupiter", nombre: "Júpiter", x: 700, y: 330 },
  { id: "europa", nombre: "Europa", x: 580, y: 470 },
];

const CONEXIONES = [
  ["tierra", "luna"],
  ["tierra", "iss"],
  ["luna", "marte"],
  ["iss", "marte"],
  ["marte", "asteroides"],
  ["asteroides", "jupiter"],
  ["jupiter", "europa"],
];

const NODO_INICIAL = "tierra";
const nodoPorId = Object.fromEntries(NODOS.map((n) => [n.id, n]));

let container, alGuardar, alEntrar;
let estado;
let mensajeEl;

export function iniciarMapa(containerEl, partida, guardarCb, entrarCb) {
  detenerMapa();
  container = containerEl;
  alGuardar = guardarCb;
  alEntrar = entrarCb;

  estado = {
    nodoActual: partida?.nodoActual ?? NODO_INICIAL,
    completados: partida?.completados ?? [],
    desbloqueados: partida?.desbloqueados ?? [NODO_INICIAL],
  };

  renderizarMapa();
}

export function detenerMapa() {
  if (container) {
    container.innerHTML = "";
  }
}

function renderizarMapa() {
  if (!container) return;

  container.innerHTML = `
    <svg class="mapa-conexiones" width="100%" height="100%">
      ${CONEXIONES.map(([ida, idb]) => {
        const a = nodoPorId[ida];
        const b = nodoPorId[idb];
        return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="linea-conexion" />`;
      }).join("")}
    </svg>
    <div class="mapa-nodos">
      ${NODOS.map((n) => {
        const completado = estado.completados.includes(n.id);
        const desbloqueado = estado.desbloqueados.includes(n.id);
        const actual = estado.nodoActual === n.id;

        let clases = "nodo";
        if (completado) clases += " completado";
        if (desbloqueado) clases += " desbloqueado";
        else clases += " bloqueado";
        if (actual) clases += " actual";

        return `
          <div class="${clases}" data-id="${n.id}" style="left: ${n.x}px; top: ${n.y}px;">
            <span class="nodo-punto"></span>
            <span class="nodo-nombre">${n.nombre}</span>
          </div>
        `;
      }).join("")}
    </div>
    <div class="mapa-mensaje">${mensajeEl || "Haz clic en un nodo desbloqueado"}</div>
  `;

  // Asignar eventos de clic a los nodos
  container.querySelectorAll(".nodo").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.id;
      manejarClickNodo(id);
    });
  });
}

function manejarClickNodo(id) {
  const nodo = nodoPorId[id];

  if (!estado.desbloqueados.includes(nodo.id)) {
    mensajeEl = `"${nodo.nombre}" está bloqueado`;
    renderizarMapa();
    return;
  }

  estado.nodoActual = nodo.id;

  if (alEntrar && alEntrar(nodo)) return;

  if (estado.completados.includes(nodo.id)) {
    mensajeEl = `"${nodo.nombre}" ya está completada`;
    renderizarMapa();
    return;
  }

  estado = completarMision(estado, nodo.id);
  mensajeEl = `Misión "${nodo.nombre}" completada`;
  guardar();
  renderizarMapa();
}

export function completarMision(est, id) {
  const completados = est.completados ?? [];
  const desbloqueados = est.desbloqueados ?? [NODO_INICIAL];
  if (!completados.includes(id)) completados.push(id);

  CONEXIONES.forEach(([a, b]) => {
    if (a === id && !desbloqueados.includes(b)) desbloqueados.push(b);
    if (b === id && !desbloqueados.includes(a)) desbloqueados.push(a);
  });

  return { ...est, completados, desbloqueados };
}

function guardar() {
  alGuardar({ ...estado });
}
