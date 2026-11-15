/**
 * Inicializa los eventos de la pantalla de menú principal.
 * @param {Object} handlers - Objeto con las funciones a ejecutar en cada botón.
 */
export default function inicializarMenu({
  onJugar,
  onOpciones,
  onInfo,
  onCreditos,
}) {
  const btnJugar = document.getElementById("btn-jugar");
  const btnOpciones = document.getElementById("btn-opciones");
  const btnInfo = document.getElementById("btn-info");
  const btnCreditos = document.getElementById("btn-creditos");

  // Asignar listeners solo si los elementos existen en el DOM
  if (btnJugar && onJugar) {
    btnJugar.addEventListener("click", onJugar);
  }

  if (btnOpciones && onOpciones) {
    btnOpciones.addEventListener("click", onOpciones);
  }

  if (btnInfo && onInfo) {
    btnInfo.addEventListener("click", onInfo);
  }

  if (btnCreditos && onCreditos) {
    btnCreditos.addEventListener("click", onCreditos);
  }
}
