import "./style.css";
import "material-symbols";

// Importar partials
import menuHtml from "./partials/menu.html?raw";
import slotsHtml from "./partials/slots.html?raw";
import misionHtml from "./partials/mision.html?raw";
import juegoHtml from "./partials/juego.html?raw";
import investigacionHtml from "./partials/investigacion.html?raw";

// Importar lógica y estado
import inicializarMenu from "./screens/menu.js";
import inicializarSlots from "./screens/slots.js";
import inicializarMision from "./screens/mision.js";
import abrirDialogoDinamico from "./screens/dialog.js";
import configurarJuego from "./screens/juego.js";
import gameState from "./game-state.js";

document.getElementById("pantalla-menu").innerHTML = menuHtml;
document.getElementById("pantalla-slots").innerHTML = slotsHtml;
document.getElementById("pantalla-mision").innerHTML = misionHtml;
document.getElementById("pantalla-juego").innerHTML = juegoHtml;
document.getElementById("pantalla-investigacion").innerHTML = investigacionHtml;

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
    const opcionesActuales = gameState.opciones;

    abrirDialogoDinamico({
      titulo: "Configuración y Accesibilidad",
      contenido: "Personaliza tu experiencia de juego.",
      inputs: [
        {
          id: "volumen",
          tipo: "range",
          etiqueta: "Volumen General",
          valorInicial: opcionesActuales.volumen,
          min: 0,
          max: 100,
          step: 1,
        },
        {
          id: "musica",
          tipo: "checkbox",
          etiqueta: "Reproducir Música de Fondo",
          valorInicial: opcionesActuales.musica,
        },
        {
          id: "paletaDaltonicos",
          tipo: "select",
          etiqueta: "Paleta de Colores (Daltonismo)",
          valorInicial: opcionesActuales.paletaDaltonicos || "normal",
          opciones: [
            { texto: "Normal (Por defecto)", valor: "normal" },
            { texto: "Deuteranopía (Rojo-Verde)", valor: "deuteranopia" },
            { texto: "Protanopía (Rojo)", valor: "protanopia" },
            { texto: "Tritanopía (Azul-Amarillo)", valor: "tritanopia" },
          ],
        },
      ],
      acciones: [
        {
          texto: "Guardar Cambios",
          valor: "guardar",
          alSeleccionar: (valores) => {
            // 'valores' contendrá un objeto como: { volumen: "50", musica: true, paletaDaltonicos: "deuteranopia" }

            // Actualizamos el gameState con los nuevos valores convertidos correctamente
            gameState.guardarOpciones({
              volumen: Number(valores.volumen),
              musica: valores.musica,
              paletaDaltonicos: valores.paletaDaltonicos,
            });

            console.log("Nuevas opciones guardadas:", gameState.opciones);

            // Aquí puedes disparar eventos o lógica para aplicar los cambios visualmente en tu juego
          },
        },
        {
          texto: "Cancelar",
          valor: "cancelar",
        },
      ],
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
      configurarJuego();
    },
    onVolver: () => {
      mostrarPantalla("pantalla-menu");
    },
  });
}
