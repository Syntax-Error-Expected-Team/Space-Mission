export default function abrirDialogoDinamico({
  titulo,
  contenido,
  inputs = [],
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

  if (contenido) {
    const mensaje = document.createElement("p");
    mensaje.textContent = contenido;
    contenedor.append(mensaje);
  }

  // Contenedor para los inputs dinámicos
  const contenedorInputs = document.createElement("div");
  contenedorInputs.className = "dialog-inputs";

  // Objeto para guardar las referencias a los elementos creados
  const referenciasInputs = {};

  inputs.forEach(
    ({
      id,
      tipo = "text",
      etiqueta,
      valorInicial,
      opciones = [],
      min,
      max,
      step,
    }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "dialog-input-group";

      const label = document.createElement("label");
      label.textContent = etiqueta;
      if (id) label.htmlFor = id;
      wrapper.append(label);

      let input;

      if (tipo === "select") {
        input = document.createElement("select");
        opciones.forEach(({ texto, valor }) => {
          const option = document.createElement("option");
          option.value = valor;
          option.textContent = texto;
          if (valor === valorInicial) option.selected = true;
          input.append(option);
        });
      } else if (tipo === "checkbox") {
        input = document.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(valorInicial);
      } else {
        input = document.createElement("input");
        input.type = tipo;
        if (valorInicial !== undefined) input.value = valorInicial;
        if (min !== undefined) input.min = min;
        if (max !== undefined) input.max = max;
        if (step !== undefined) input.step = step;
      }

      if (id) input.id = id;
      wrapper.append(input);
      contenedorInputs.append(wrapper);

      // Guardamos la referencia usando el id (o la etiqueta como respaldo)
      referenciasInputs[id || etiqueta] = input;
    },
  );

  if (inputs.length > 0) {
    contenedor.append(contenedorInputs);
  }

  const botones = document.createElement("div");
  botones.className = "dialog-acciones";

  const accionesDialogo =
    acciones.length > 0 ? acciones : [{ texto: "Cerrar" }];

  accionesDialogo.forEach(({ texto, valor = "", alSeleccionar }) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.addEventListener("click", () => {
      // Recolectamos el valor actual de cada input en un objeto plano
      const valoresInputs = {};
      Object.entries(referenciasInputs).forEach(([key, el]) => {
        valoresInputs[key] = el.type === "checkbox" ? el.checked : el.value;
      });

      // Ejecutamos la función de selección pasando los valores recolectados
      alSeleccionar?.(valoresInputs);
      dialog.close(valor);
    });
    botones.append(boton);
  });

  contenedor.append(botones);
  dialog.replaceChildren(contenedor);
  dialog.showModal();
}
