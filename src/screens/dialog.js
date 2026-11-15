export default function abrirDialogoDinamico({
  titulo,
  contenido,
  acciones = [],
}) {
  const dialog = document.getElementById("dialog-global");

  if (!(dialog instanceof HTMLDialogElement)) {
    throw new Error('No se encontró el diálogo global "dialog-global".');
  }

  if (dialog.open) {
    dialog.close();
  }

  const contenedor = document.createElement("div");
  contenedor.className = "dialog-contenido";

  const encabezado = document.createElement("h2");
  encabezado.textContent = titulo;
  contenedor.append(encabezado);

  const mensaje = document.createElement("p");
  mensaje.textContent = contenido;
  contenedor.append(mensaje);

  const botones = document.createElement("div");
  botones.className = "dialog-acciones";

  const accionesDialogo =
    acciones.length > 0 ? acciones : [{ texto: "Cerrar" }];

  accionesDialogo.forEach(({ texto, valor = "", alSeleccionar }) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.addEventListener("click", () => {
      alSeleccionar?.();
      dialog.close(valor);
    });
    botones.append(boton);
  });

  contenedor.append(botones);
  dialog.replaceChildren(contenedor);
  dialog.showModal();
}
