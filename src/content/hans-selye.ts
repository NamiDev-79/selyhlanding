/**
 * Biografía y tributo a Hans Selye, pionero mundial en el estudio del estrés biológico
 * y fuente de inspiración conceptual y nominal de Selyh.
 */

export const hansSelyeDoc = {
  name: "Hans Selye",
  lifespan: "1907 – 1982",
  title: "Hans Selye: la ciencia del estrés y el origen de Selyh",
  eyebrow: "Inspiración & Raíces",
  description:
    "El médico y endocrinólogo que transformó para siempre nuestra comprensión del cuerpo humano al demostrar que toda sobrecarga genera una respuesta universal de adaptación. Esta es la visión científica detrás de Selyh.",
  portrait: {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Portrait_Hans_Selye.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    alt: "Retrato del Dr. Hans Selye en su laboratorio de la Universidad de Montreal",
    caption: "Dr. Hans Selye (1907 – 1982), Universidad de Montreal. Fotografía de archivo histórico.",
  },
  quote: {
    text: "No es el estrés lo que nos destruye, sino nuestra reacción ante él.",
    author: "Dr. Hans Selye",
    context: "The Stress of Life (1956)",
  },
  facts: [
    { label: "Nacimiento", value: "Viena, Imperio austrohúngaro (1907)" },
    { label: "Laboratorio", value: "Universidad de Montreal, Canadá" },
    { label: "Hito", value: "Primer artículo en Nature sobre estrés (1936)" },
    { label: "Legado", value: "+1,700 artículos científicos y 39 libros" },
  ],
  sections: [
    {
      id: "sindrome-general",
      h: "El síndrome de estar «simplemente enfermo»",
      p: [
        "En 1926, mientras cursaba su segundo año en la Facultad de Medicina de la Universidad de Praga, un joven Hans Selye notó algo que desconcertó a sus profesores: pacientes aquejados de enfermedades enteramente distintas —infecciones graves, neoplasias, quemaduras o intoxicaciones— compartían una constelación de síntomas idénticos. Todos lucían exhaustos, perdían el apetito, experimentaban dolores difusos y manifestaban una profunda fatiga fisiológica.",
        "Mientras la medicina de la época se obsesionaba exclusivamente con encontrar los síntomas diferenciales específicos de cada patología, Selye formuló una pregunta contracorriente: ¿por qué el organismo responde de una manera tan constante y universal ante cualquier forma de adversidad?",
        "Esa inquietud germinó diez años más tarde en la Universidad de McGill y luego en el Instituto de Medicina y Cirugía Experimental de la Universidad de Montreal, donde formalizó en 1936 su célebre artículo en Nature: «A Syndrome Produced by Diverse Nocuous Agents». Había nacido el concepto científico moderno de estrés.",
      ],
    },
    {
      id: "fases-gas",
      h: "El Síndrome General de Adaptación (GAS)",
      p: [
        "Selye demostró que el estrés no es una emoción pasajera ni una debilidad de carácter: es la respuesta fisiológica no específica del cuerpo ante cualquier demanda que se le imponga. Para describir su evolución temporal, definió las tres fases del Síndrome General de Adaptación:",
      ],
      stages: [
        {
          num: "01",
          name: "Reacción de alarma",
          desc: "El organismo percibe una demanda aguda. El sistema simpático-adrenal libera catecolaminas y corticoides; la frecuencia cardíaca y la glucosa se elevan. El cuerpo moviliza todas sus defensas de inmediato.",
        },
        {
          num: "02",
          name: "Fase de resistencia",
          desc: "Si la demanda persiste, el cuerpo se adapta y resiste. A simple vista todo parece marchar con normalidad y el rendimiento se mantiene, pero la «energía de adaptación» se consume en silencio entre bastidores.",
        },
        {
          num: "03",
          name: "Fase de agotamiento",
          desc: "Cuando la demanda se prolonga sin pausas reparadoras, los recursos fisiológicos se agotan. La capacidad de adaptación colapsa, abriendo la puerta al deterioro cognitivo, la fatiga crónica y el burnout.",
        },
      ],
    },
    {
      id: "eustres-distres",
      h: "Eustrés vs. Distrés: el condimento de la vida",
      p: [
        "Una de las aclaraciones más lúcidas de Hans Selye fue recordar que el estrés no debe erradicarse por completo. Como él mismo escribió: «La ausencia total de estrés es la muerte. El estrés es el condimento de la vida».",
        "Selye acuñó el término eustrés (del griego eu-, «bueno») para referirse a la tensión positiva, motivante y constructiva: el estímulo intelectual que nos enfoca al resolver un algoritmo complejo, la satisfacción de despachar un proyecto a producción o la emoción de aprender una nueva disciplina.",
        "El problema real no es la presencia de retos, sino el distrés: la sobrecarga continuada en el tiempo sin tregua biológica, donde las demandas del entorno superan sistemáticamente los recursos individuales disponibles.",
      ],
    },
    {
      id: "por-que-selyh",
      h: "De Selye a Selyh: tecnología con respeto biológico",
      p: [
        "En la industria tecnológica y el desarrollo de software contemporáneo, las amenazas físicas han sido reemplazadas por pantallas, guardias nocturnas, dependencias caídas y calendarios saturados. El mayor riesgo para un equipo no es un pico de trabajo puntual, sino la fase de resistencia invisible: semanas enteras donde el cuerpo sigue compensando la fatiga hasta que ya es demasiado tarde.",
        "Decidimos llamar a nuestro proyecto Selyh como un homenaje directo a Hans Selye. Su investigación demostró que el cuerpo humano emite señales de aviso antes de quebrarse; nuestra labor es hacer que esas señales puedan escucharse a tiempo, sin invadir la privacidad y sin salir del flujo de trabajo.",
        "Selyh no busca convertir a las personas en máquinas de productividad indiferentes al cansancio. Al contrario: busca devolverle al trabajo intelectual la serenidad, la medición honesta y el valor de la pausa que Hans Selye defendió a lo largo de toda su vida.",
      ],
    },
  ],
  legacyTakeaways: [
    {
      title: "Medir antes del agotamiento",
      text: "La fase de resistencia enmascara el cansancio. Selyh detecta la tendencia antes de que el cuerpo colapse.",
    },
    {
      title: "Tu línea base personal",
      text: "Cada organismo tiene una reserva adaptativa distinta. Por eso Selyh te compara contigo mismo, nunca con los demás.",
    },
    {
      title: "Intervenciones breves",
      text: "Selye demostró que pequeñas fases de tregua restauran la energía de adaptación para evitar el distrés crónico.",
    },
  ],
} as const;

