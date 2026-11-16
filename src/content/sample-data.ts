/**
 * Datos de EJEMPLO para los gráficos de la landing (no son de ninguna persona real).
 * zScore: desvío respecto de la línea base personal (0 = tu día habitual).
 */
export const sampleTrend = [
  -0.3, 0.1, -0.2, 0.2, -0.1, 0.0, -0.4, 0.3, 0.1, -0.2, 0.0, 0.2, -0.1, 0.1, 0.0, 0.3, 0.2, 0.5, 0.4, 0.7, 0.6, 0.9, 0.8, 1.0, 0.7, 0.4, 0.2, 0.1,
];
export const sampleTrendRisingAt = 19; // índice donde la tendencia pasa a "en aumento"
export const sampleTrendExerciseAt = 23; // a partir de aquí la persona hizo pausas

/** Carga media semanal de un equipo (agregado, ≥5 personas) durante 12 semanas. */
export const sampleTeam = [0.1, 0.0, 0.2, 0.1, 0.3, 0.6, 0.8, 0.7, 0.4, 0.3, 0.2, 0.1];
export const sampleTeamEvents = [
  { at: 5, label: "rotación de guardias" },
  { at: 8, label: "se repartió la guardia" },
];
