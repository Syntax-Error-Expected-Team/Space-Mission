import gameState from "./game-state.js";

const MS_POR_LETRA = 28;
const FRAMES_MAX_SIN_OBJETIVO = 120; 

let cancelarActual = null;

function el(tag, clase, texto) {
  const nodo = document.createElement(tag);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function icono(nombre) {
  const nodo = el("span", "material-symbols-outlined", nombre);
  nodo.setAttribute("aria-hidden", "true");
  return nodo;
}

const SVG_ROBOT = `
<svg class="robot-svg" viewBox="0 0 120 150" aria-hidden="true">
  <g class="robot-llama">
    <ellipse cx="60" cy="136" rx="9" ry="7" fill="#ff9f1c"/>
    <ellipse cx="60" cy="134" rx="5" ry="4" fill="#ffe08a"/>
  </g>
  <g class="robot-cuerpo-g">
    <g class="robot-brazo izq"><rect x="22" y="78" width="14" height="32" rx="7" fill="#c9d3ee"/></g>
    <g class="robot-brazo der"><rect x="84" y="78" width="14" height="32" rx="7" fill="#c9d3ee"/></g>
    <rect x="36" y="74" width="48" height="44" rx="14" fill="#e8eeff"/>
    <circle class="robot-luz" cx="60" cy="96" r="7" fill="#4cc9f0"/>
    <rect x="44" y="108" width="32" height="5" rx="2.5" fill="#c9d3ee"/>

    <g class="robot-cabeza-g">
      <g class="robot-antena">
        <line x1="60" y1="24" x2="60" y2="10" stroke="#c9d3ee" stroke-width="3" stroke-linecap="round"/>
        <circle class="robot-bola" cx="60" cy="8" r="5" fill="#ff5d73"/>
      </g>
      <rect x="28" y="22" width="64" height="48" rx="18" fill="#e8eeff"/>
      <rect x="36" y="30" width="48" height="32" rx="12" fill="#10183a"/>
      <g class="robot-ojos">
        <ellipse class="robot-ojo" cx="50" cy="44" rx="6" ry="7" fill="#4cc9f0"/>
        <ellipse class="robot-ojo" cx="70" cy="44" rx="6" ry="7" fill="#4cc9f0"/>
      </g>
      <path class="robot-boca boca-feliz" d="M51 54 Q60 61 69 54" fill="none" stroke="#4cc9f0" stroke-width="3" stroke-linecap="round"/>
      <path class="robot-boca boca-plana" d="M53 56 L67 56" fill="none" stroke="#4cc9f0" stroke-width="3" stroke-linecap="round"/>
      <circle cx="31" cy="46" r="4" fill="#ff9fb2" opacity=".7"/>
      <circle cx="89" cy="46" r="4" fill="#ff9fb2" opacity=".7"/>
    </g>
  </g>
</svg>`;
export function tutorialVisto(id) {
  const partida = gameState.obtenerSlotActual();
  return Boolean(partida?.tutoriales?.[id]);
}

export function marcarTutorialVisto(id) {
  const partida = gameState.obtenerSlotActual();
  if (!partida) return;
  gameState.actualizarSlotActual({
    tutoriales: { ...(partida.tutoriales ?? {}), [id]: true },
  });
}

export async function tutorialUnaVez(id, config) {
  if (tutorialVisto(id)) return false;
  const completo = await hablarRobot(config);
  if (completo) marcarTutorialVisto(id);
  return completo;
}
export function tutorialCuandoSeVea(id, contenedor, config, espera = 500) {
  if (!contenedor || tutorialVisto(id)) return;
  const observador = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    observador.disconnect();
    setTimeout(() => tutorialUnaVez(id, config), espera);
  });
  observador.observe(contenedor);
}
export const porTexto = (texto, selector = "button, a, [role='button'], li") => () =>
  [...document.querySelectorAll(selector)].find(
    (e) => e.getBoundingClientRect().width > 0 && e.textContent.includes(texto),
  ) ?? null;
export function hablarRobot({ pasos, objetivo, padre = document.body }) {
  cancelarActual?.();

  return new Promise((resolver) => {
    const lista = pasos.map((p) => (typeof p === "string" ? { texto: p } : p));
    if (lista.length === 0) return resolver();

    const capa = el("div", "robot-capa");
    const aro = el("div", "robot-aro");
    const flecha = el("div", "robot-flecha");
    const flechaIcono = icono("arrow_downward");
    flecha.append(flechaIcono);
    aro.hidden = true;
    flecha.hidden = true;

    const escena = el("div", "robot-escena");
    const robot = el("div", "robot");
    robot.innerHTML = SVG_ROBOT;
    const globo = el("div", "robot-globo");
    globo.setAttribute("role", "status");
    globo.setAttribute("aria-live", "polite");
    const texto = el("p", "robot-texto");
    const pie = el("div", "robot-globo-pie");
    const puntos = el("div", "robot-puntos");
    lista.forEach(() => puntos.append(el("span", "robot-punto")));
    const boton = el("button", "robot-siguiente");
    boton.type = "button";
    pie.append(puntos, boton);
    globo.append(texto, pie);
    escena.append(robot, globo);

    const propios = [capa, aro, flecha, escena];
    padre.append(...propios);

    let indice = 0;
    let apuntando = false;
    let foco = null;
    let cerrado = false;
    let timer = 0;
    let raf = 0;
    let sinObjetivo = 0;
    let destinoEscuchado = null;
    const congelados = [];

const buscar = (def) => {
  if (!def) return null;
  let d;
  if (typeof def === "function") d = def();
  else if (def instanceof Element) d = def;
  else d = document.querySelector(def);
  if (!d || !d.isConnected) return null;
  const r = d.getBoundingClientRect();
  return r.width > 0 && r.height > 0 ? d : null;
};
const obtenerDestino = () => buscar(objetivo);

    const congelar = (si) => {
      if (si) {
        [...padre.children].forEach((n) => {
          if (!propios.includes(n) && !n.inert) {
            n.inert = true;
            congelados.push(n);
          }
        });
      } else {
        congelados.splice(0).forEach((n) => (n.inert = false));
      }
    };

    let completarTexto = () => {};
    const detenerEscritura = () => {
      clearInterval(timer);
      timer = 0;
      robot.classList.remove("hablando");
    };
    const escribir = (t) => {
      detenerEscritura();
      const letras = Array.from(t);
      let k = 0;
      texto.textContent = "";
      robot.classList.add("hablando");
      completarTexto = () => {
        detenerEscritura();
        texto.textContent = t;
      };
      timer = setInterval(() => {
        k++;
        texto.textContent = letras.slice(0, k).join("");
        if (k >= letras.length) detenerEscritura();
      }, MS_POR_LETRA);
    };

    function mostrar(n) {
      indice = n;
      const paso = lista[n];
      const ultimo = n === lista.length - 1;
      apuntando = Boolean(objetivo) && ultimo;

      robot.dataset.expresion = paso.expresion ?? (apuntando ? "senalando" : "feliz");
      boton.hidden = apuntando;
      boton.replaceChildren(ultimo ? "¡Entendido!" : "Siguiente", icono("arrow_forward"));
      puntos.querySelectorAll(".robot-punto").forEach((p, i) =>
        p.classList.toggle("activo", i <= n),
      );
      foco = paso.resaltar ?? null;
      congelar(!apuntando);

      globo.classList.remove("pop");
      void globo.offsetWidth; 
      globo.classList.add("pop");

      escribir(paso.texto);
      if (!apuntando) boton.focus({ preventScroll: true });
    }

    function avanzar() {
      if (timer) return completarTexto(); 
      if (apuntando) return;
      if (indice < lista.length - 1) mostrar(indice + 1);
      else cerrar();
    }

    const alClickDestino = () => setTimeout(cerrar, 0); // deja que el click llegue primero al nodo

    function seguir() {
  if (cerrado) return;

  const destino = apuntando ? obtenerDestino() : null;
  const resaltado = !apuntando && foco ? buscar(foco) : null;
  const guia = destino ?? resaltado;

  aro.hidden = !guia;
  flecha.hidden = !destino;

  if (guia) {
    sinObjetivo = 0;
    if (destino && destino !== destinoEscuchado) {
      destinoEscuchado?.removeEventListener("click", alClickDestino, true);
      destino.addEventListener("click", alClickDestino, true);
      destinoEscuchado = destino;
    }

    const r = guia.getBoundingClientRect();
    const m = 8;
    const x1 = Math.round(r.left - m);
    const y1 = Math.round(r.top - m);
    const x2 = Math.round(r.right + m);
    const y2 = Math.round(r.bottom + m);

    capa.style.clipPath =
      `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ` +
      `${x1}px ${y1}px, ${x1}px ${y2}px, ${x2}px ${y2}px, ${x2}px ${y1}px, ${x1}px ${y1}px)`;

    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    if (destino) {
      const lado = Math.max(x2 - x1, y2 - y1);
      aro.classList.remove("rect");
      Object.assign(aro.style, {
        width: `${lado}px`,
        height: `${lado}px`,
        left: `${cx - lado / 2}px`,
        top: `${cy - lado / 2}px`,
      });
      const abajo = y1 < 90;
      flechaIcono.textContent = abajo ? "arrow_upward" : "arrow_downward";
      flecha.style.left = `${cx}px`;
      flecha.style.top = `${abajo ? y2 + 4 : y1 - 62}px`;
    } else {
      aro.classList.add("rect");
      Object.assign(aro.style, {
        width: `${x2 - x1}px`,
        height: `${y2 - y1}px`,
        left: `${x1}px`,
        top: `${y1}px`,
      });
    }

    escena.classList.toggle("derecha", cx < window.innerWidth / 2);
  } else {
    capa.style.clipPath = "";
    if (apuntando && ++sinObjetivo > FRAMES_MAX_SIN_OBJETIVO) {
      console.warn("[robot] No se encontró el objetivo; se cierra el tutorial.");
      return cerrar(false);
    }
  }
  raf = requestAnimationFrame(seguir);
}
    function cerrar(completo = true) {
      if (cerrado) return;
      cerrado = true;
      cancelarActual = null;
      cancelAnimationFrame(raf);
      detenerEscritura();
      document.removeEventListener("keydown", alTeclear);
      destinoEscuchado?.removeEventListener("click", alClickDestino, true);
      congelar(false);
      capa.remove();
      aro.remove();
      flecha.remove();
      escena.classList.add("saliendo");
      setTimeout(() => escena.remove(), 400);
      resolver(completo);
    }
    cancelarActual = () => cerrar(false);

    function alTeclear(e) {
      if (e.target === boton) return; 
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        avanzar();
      }
    }

    boton.onclick = avanzar;
    globo.addEventListener("click", (e) => {
      if (e.target !== boton && timer) completarTexto();
    });
    document.addEventListener("keydown", alTeclear);

    mostrar(0);
    raf = requestAnimationFrame(seguir);
  });
}