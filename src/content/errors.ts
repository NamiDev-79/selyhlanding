/**
 * Textos para los códigos de error de la API, en UN solo archivo.
 * Si el backend agrega un código, súmalo aquí; si falta, se muestra el mensaje de la API.
 */
export const errorMessages: Record<string, string> = {
  EMAIL_NOT_VERIFIED: "Primero confirma tu correo: te enviamos un enlace al registrarte. Puedes pedir otro desde aquí.",
  CORPORATE_PLAN_REQUIRED: "Tu cuenta corporativa necesita el plan corporativo para continuar.",
  COMPANY_NAME_REQUIRED: "Indica el nombre de tu empresa.",
  CONSENT_REQUIRED: "Para guardar este dato necesitas activar el permiso de esa fuente en Privacidad.",
  PLAN_REQUIRED: "Esta función está incluida en Personal Plus y en el plan Corporativo.",
  PAYMENTS_UNAVAILABLE: "Los planes de pago aún no están disponibles. Puedes seguir con Personal Básico.",
  SEATS_EXCEEDED: "Ya usas todos los puestos contratados. Amplía los puestos para invitar a más personas.",
  SEATS_BELOW_USED: "No puedes contratar menos puestos de los que ya están en uso.",
  INVITE_INVALID: "La invitación no es válida o ya venció. Pide a tu empresa que te envíe otra.",
  INVITE_EMAIL_MISMATCH: "Esta invitación es para otro correo. Inicia sesión con la cuenta invitada.",
  TOKEN_INVALID: "El enlace no es válido o ya venció. Pide uno nuevo.",
};

export const statusMessages: Record<number, string> = {
  400: "Revisa los datos e inténtalo de nuevo.",
  401: "Tu sesión terminó. Vuelve a iniciar sesión.",
  403: "No tienes acceso a esta acción.",
  404: "No encontramos lo que buscas.",
  409: "Ese registro ya existe.",
  429: "Demasiados intentos seguidos. Espera un minuto y vuelve a probar.",
  500: "Algo falló de nuestro lado. Inténtalo en un momento.",
  503: "El servicio no está disponible ahora mismo. Inténtalo en un momento.",
};

export const networkError = "No pudimos conectar con Selyh. Revisa tu conexión e inténtalo de nuevo.";
