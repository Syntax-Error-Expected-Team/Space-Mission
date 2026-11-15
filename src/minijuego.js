import { INGRESO_MENSUAL } from "./game-state.js";

const MESES = 6;
const ACCIONES_POR_MES = 2;
const META = 100;
const PROBABILIDAD_IMPREVISTO = 0.4;

const ACCIONES = [
  {
    nombre: "Invertir en ingeniería",
    icono: "engineering",
    detalle: "+25% de preparación",
    presupuesto: 200,
    ciencia: 0,
    preparacion: 25,
  },
  {
    nombre: "Investigar",
    icono: "science",
    detalle: "+15% de preparación",
    presupuesto: 100,
    ciencia: 10,
    preparacion: 15,
  },
  {
    nombre: "Pruebas de seguridad",
    icono: "verified_user",
    detalle: "+8% y evita el imprevisto del mes",
    presupuesto: 80,
    ciencia: 5,
    preparacion: 8,
    protege: true,
  },
  {
    nombre: "Ahorrar fondos",
    icono: "savings",
    detalle: "+$150 de presupuesto",
    presupuesto: 0,
    ciencia: 0,
    preparacion: 0,
    gana: 150,
  },
];

const EVENTOS = [
  {
    texto: "Falla técnica en las pruebas: -15% de preparación.",
    aplicar: (e) => {
      e.preparacion = Math.max(0, e.preparacion - 15);
    },
  },
  {
    texto: "Sobrecosto de proveedores: -$120.",
    aplicar: (e) => {
      e.presupuesto = Math.max(0, e.presupuesto - 120);
    },
  },
];

const dinero = (n) => `$${Math.round(n).toLocaleString("es-AR")}`;

function icono(nombre, clase = "") {
  const nodo = document.createElement("span");
  nodo.className = `material-symbols-outlined ${clase}`.trim();
  nodo.setAttribute("aria-hidden", "true");
  nodo.textContent = nombre;
  return nodo;
}

function costoTexto(accion) {
  const partes = [];
  if (accion.presupuesto > 0) partes.push(dinero(accion.presupuesto));
  if (accion.ciencia > 0) partes.push(`${accion.ciencia} ciencia`);
  return partes.length ? partes.join(" + ") : "gratis";
}

function crearDialogo(titulo) {
  const dialogo = document.createElement("dialog");
  dialogo.id = "modal-minijuego";
  dialogo.innerHTML = `
    <header class="mj-cabecera">
      <h2 class="mj-titulo"></h2>
      <span class="mj-mes"></span>
    </header>
    <section class="mj-recursos">
      <div class="mj-recurso">
        <span class="material-symbols-outlined" aria-hidden="true">payments</span>
        Presupuesto <strong class="mj-presupuesto"></strong>
      </div>
      <div class="mj-recurso">
        <span class="material-symbols-outlined" aria-hidden="true">science</span>
        Ciencia <strong class="mj-ciencia"></strong>
      </div>
      <div class="mj-recurso">
        <span class="material-symbols-outlined" aria-hidden="true">bolt</span>
        Acciones <strong class="mj-acciones-restantes"></strong>
      </div>
    </section>
    <div class="mj-preparacion">
      <div class="mj-prep-texto">
        <span>Preparación de la misión</span>
        <strong class="mj-prep-valor"></strong>
      </div>
      <div class="mj-prep-barra"><div class="mj-prep-relleno"></div></div>
    </div>
    <div class="mj-acciones"></div>
    <ul class="mj-registro"></ul>
    <footer class="mj-pie">
      <button type="button" class="mj-terminar-mes">Terminar mes</button>
    </footer>
    <div class="mj-final">
      <span class="material-symbols-outlined mj-final-icono" aria-hidden="true"></span>
      <h2 class="mj-final-titulo"></h2>
      <p class="mj-final-detalle"></p>
      <button type="button" class="mj-final-boton">Continuar</button>
    </div>
  `;
  dialogo.querySelector(".mj-titulo").textContent = titulo;
  dialogo.addEventListener("cancel", (e) => e.preventDefault());
  document.body.append(dialogo);
  return dialogo;
}

export function jugarMinijuego({ titulo, presupuesto, ciencia }) {
  return new Promise((resolver) => {
    const dialogo = crearDialogo(titulo);
    const q = (selector) => dialogo.querySelector(selector);

    const estado = {
      presupuesto,
      ciencia,
      preparacion: 0,
      mes: 1,
      acciones: ACCIONES_POR_MES,
      protegido: false,
      terminado: false,
      registro: [
        `Tenés ${MESES} meses para llevar la preparación al ${META}%.`,
      ],
    };

    const puedePagar = (accion) =>
      estado.presupuesto >= accion.presupuesto && estado.ciencia >= accion.ciencia;

    const botones = ACCIONES.map((accion) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "mj-accion";

      const texto = document.createElement("span");
      texto.className = "mj-accion-texto";
      const nombre = document.createElement("strong");
      nombre.textContent = accion.nombre;
      const detalle = document.createElement("small");
      detalle.textContent = `${accion.detalle} · Costo: ${costoTexto(accion)}`;
      texto.append(nombre, detalle);

      boton.append(icono(accion.icono), texto);
      boton.onclick = () => ejecutar(accion);
      q(".mj-acciones").append(boton);
      return { boton, accion };
    });

    function pintar() {
      q(".mj-mes").textContent = `Mes ${estado.mes}/${MESES}`;
      q(".mj-presupuesto").textContent = dinero(estado.presupuesto);
      q(".mj-ciencia").textContent = estado.ciencia;
      q(".mj-acciones-restantes").textContent = estado.acciones;
      q(".mj-prep-valor").textContent = `${Math.min(100, estado.preparacion)}%`;
      q(".mj-prep-relleno").style.width = `${Math.min(100, estado.preparacion)}%`;

      botones.forEach(({ boton, accion }) => {
        boton.disabled =
          estado.terminado || estado.acciones <= 0 || !puedePagar(accion);
      });
      q(".mj-terminar-mes").disabled = estado.terminado;

      const items = estado.registro.slice(-4).reverse().map((texto) => {
        const li = document.createElement("li");
        li.textContent = texto;
        return li;
      });
      q(".mj-registro").replaceChildren(...items);
    }

    function ejecutar(accion) {
      if (estado.terminado || estado.acciones <= 0 || !puedePagar(accion)) return;

      estado.presupuesto -= accion.presupuesto;
      estado.ciencia -= accion.ciencia;
      estado.presupuesto += accion.gana ?? 0;
      estado.preparacion += accion.preparacion;
      if (accion.protege) estado.protegido = true;
      estado.acciones -= 1;
      estado.registro.push(`${accion.nombre}: ${accion.detalle}.`);

      pintar();
      if (estado.preparacion >= META) terminar(true);
    }

    function cerrarMes() {
      if (estado.terminado) return;

      estado.presupuesto += INGRESO_MENSUAL.presupuesto;
      estado.ciencia += INGRESO_MENSUAL.ciencia;
      estado.registro.push(
        `Ingreso del mes: +${dinero(INGRESO_MENSUAL.presupuesto)} y +${INGRESO_MENSUAL.ciencia} ciencia.`,
      );

      if (Math.random() < PROBABILIDAD_IMPREVISTO) {
        if (estado.protegido) {
          estado.registro.push("Imprevisto evitado gracias a las pruebas de seguridad.");
        } else {
          const evento = EVENTOS[Math.floor(Math.random() * EVENTOS.length)];
          evento.aplicar(estado);
          estado.registro.push(evento.texto);
        }
      }
      estado.protegido = false;

      if (estado.mes >= MESES) {
        pintar();
        terminar(estado.preparacion >= META);
        return;
      }

      estado.mes += 1;
      estado.acciones = ACCIONES_POR_MES;
      pintar();
    }

    function terminar(gano) {
      if (estado.terminado) return;
      estado.terminado = true;
      pintar();

      const final = q(".mj-final");
      final.classList.add("visible", gano ? "gano" : "perdio");
      q(".mj-final-icono").textContent = gano ? "task_alt" : "dangerous";
      q(".mj-final-titulo").textContent = gano ? "Tarea completada" : "Misión fallida";
      q(".mj-final-detalle").textContent = gano
        ? `Preparación al ${Math.min(100, estado.preparacion)}% en el mes ${estado.mes}.`
        : `Se acabó el tiempo con la preparación en ${estado.preparacion}%.`;
      if (!gano) dialogo.classList.add("mj-sacudida");

      q(".mj-final-boton").onclick = () => {
        dialogo.close();
        dialogo.remove();
        resolver({
          gano,
          presupuesto: estado.presupuesto,
          ciencia: estado.ciencia,
        });
      };
    }

    q(".mj-terminar-mes").onclick = cerrarMes;

    pintar();
    dialogo.showModal();
  });
}