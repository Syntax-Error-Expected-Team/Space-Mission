const TOTAL_SLOTS = 3;
const CLAVE_ULTIMO_SLOT = "spaceMission:ultimoSlot";
const CLAVE_OPCIONES = "spaceMission:opciones";
const claveSlot = (n) => `spaceMission:partida:${n}`;

export const INGRESO_MENSUAL = {
  presupuesto: 250,
  ciencia: 20,
};
export const INVESTIGACION_INICIAL = "fundamentos_cientificos";
export const MISION_INICIAL = "lanzamiento_satelite";

const opcionesPorDefecto = { musica: true, volumen: 50 };

export class GameStateManager {
  constructor() {
    if (GameStateManager.instance) {
      return GameStateManager.instance;
    }
    GameStateManager.instance = this;

    // Estado en memoria
    this.slotActual = this.cargarUltimoSlot();
    this.opciones = this.cargarOpciones();
  }

  // ==================== OPCIONES ====================
  cargarOpciones() {
    try {
      return {
        ...opcionesPorDefecto,
        ...JSON.parse(localStorage.getItem(CLAVE_OPCIONES)),
      };
    } catch {
      return { ...opcionesPorDefecto };
    }
  }

  guardarOpciones(nuevasOpciones) {
    this.opciones = { ...this.opciones, ...nuevasOpciones };
    localStorage.setItem(CLAVE_OPCIONES, JSON.stringify(this.opciones));
  }

  // ==================== SLOTS Y PARTIDAS ====================
  cargarUltimoSlot() {
    const slot = localStorage.getItem(CLAVE_ULTIMO_SLOT);
    return slot ? Number(slot) : null;
  }

  guardarUltimoSlot(n) {
    this.slotActual = n;
    localStorage.setItem(CLAVE_ULTIMO_SLOT, n);
  }

  /**
   * Carga un slot específico y lo devuelve como un objeto estructurado.
   */
  cargarSlot(n) {
    try {
      const data = localStorage.getItem(claveSlot(n));
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Crea o inicializa una nueva partida en un slot.
   */
  crearSlot(n, datosIniciales = {}) {
    const slotObjeto = {
      idSlot: n,
      creado: Date.now(),
      mes: 1,
      presupuesto: 1000,
      ciencia: 0,
      investigacionesCompletadas: [INVESTIGACION_INICIAL],
      misionActual: MISION_INICIAL,
      taller: { partesInstaladas: [], herramientasCargadas: [] },
      nodoActual: "tierra",
      completados: [],
      desbloqueados: ["tierra"],
      ...datosIniciales,
    };

    localStorage.setItem(claveSlot(n), JSON.stringify(slotObjeto));
    this.guardarUltimoSlot(n);
    return slotObjeto;
  }

  /**
   * Borra un slot de localStorage.
   */
  borrarSlot(n) {
    localStorage.removeItem(claveSlot(n));
    if (this.slotActual === n) {
      this.slotActual = null;
      localStorage.removeItem(CLAVE_ULTIMO_SLOT);
    }
  }

  /**
   * Verifica si existe alguna partida guardada.
   */
  hayAlgunaPartida() {
    for (let n = 1; n <= TOTAL_SLOTS; n++) {
      if (this.cargarSlot(n)) return true;
    }
    return false;
  }

  // ==================== GESTIÓN DEL SLOT ACTUAL ====================

  /**
   * Obtiene la información completa del slot actualmente seleccionado.
   */
  obtenerSlotActual() {
    if (!this.slotActual) return null;
    return this.cargarSlot(this.slotActual);
  }

  /**
   * Actualiza propiedades específicas del slot actual (ej. presupuesto, día, nodo).
   * @param {Object} cambios - Objeto con las propiedades a actualizar.
   */
  actualizarSlotActual(cambios) {
    if (!this.slotActual) {
      console.warn("No hay ningún slot seleccionado actualmente.");
      return null;
    }

    const partidaActual = this.cargarSlot(this.slotActual);
    if (!partidaActual) return null;

    const partidaActualizada = {
      ...partidaActual,
      ...cambios,
    };

    localStorage.setItem(
      claveSlot(this.slotActual),
      JSON.stringify(partidaActualizada),
    );
    return partidaActualizada;
  }
}

const gameState = new GameStateManager();
export default gameState;
