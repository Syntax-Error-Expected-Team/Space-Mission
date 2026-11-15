import gameState from "../../game-state.js";
import abrirDialogoDinamico from "../dialog.js";

export const FRAGMENTOS_INFORMACION = [
  {
    id: "sputnik-1",
    hitoId: "satelites_comunicacion",
    titulo: "Sputnik 1",
    fecha: "4 de octubre de 1957",
    texto:
      "Lanzado por la Unión Soviética, fue el primer satélite artificial en orbitar la Tierra. Emitió señales de radio durante 21 días y marcó el inicio de la era espacial.",
  },
];

function obtenerPartida() {
  const partida = gameState.obtenerSlotActual();
  if (!partida) {
    throw new Error("No hay una campaña activa para consultar la información.");
  }

  return partida;
}

function obtenerIdsDesbloqueados(partida) {
  return new Set(
    Array.isArray(partida.fragmentosInformacionDesbloqueados)
      ? partida.fragmentosInformacionDesbloqueados
      : [],
  );
}

export function desbloquearInformacionPorHito(hitoId) {
  const partida = obtenerPartida();
  const idsDesbloqueados = obtenerIdsDesbloqueados(partida);
  const nuevosFragmentos = FRAGMENTOS_INFORMACION.filter(
    (fragmento) =>
      fragmento.hitoId === hitoId && !idsDesbloqueados.has(fragmento.id),
  );

  if (nuevosFragmentos.length === 0) return [];

  const partidaActualizada = gameState.actualizarSlotActual({
    fragmentosInformacionDesbloqueados: [
      ...idsDesbloqueados,
      ...nuevosFragmentos.map(({ id }) => id),
    ],
  });
  if (!partidaActualizada) {
    throw new Error(
      `No se pudo guardar la información desbloqueada para el hito "${hitoId}".`,
    );
  }

  return nuevosFragmentos;
}

export function mostrarDialogoInformacion() {
  const partida = obtenerPartida();
  const idsDesbloqueados = obtenerIdsDesbloqueados(partida);
  const fragmentosDesbloqueados = FRAGMENTOS_INFORMACION.filter(({ id }) =>
    idsDesbloqueados.has(id),
  );
  const contenidoFragmentos = fragmentosDesbloqueados.length
    ? fragmentosDesbloqueados
        .map(
          ({ titulo, fecha, texto }) =>
            `${titulo} — ${fecha}\n${texto}`,
        )
        .join("\n\n")
    : "Aún no desbloqueaste fragmentos de información. Completa hitos de investigación para descubrirlos.";

  abrirDialogoDinamico({
    titulo: "Información desbloqueada",
    contenido: `${contenidoFragmentos}\n\nNota: nueva información se desbloqueará más adelante al alcanzar otros hitos.`,
    acciones: [{ texto: "Cerrar" }],
  });
}
