# Selyh – Web (Next.js 16 + TypeScript)

Una sola app con dos caras: la **landing pública** (estática, para SEO) y el **panel** personal y corporativo.

## Correr

```bash
docker compose up -d            # en selyh-startup/: Postgres y Redis
npm --prefix ../backend run dev # API en http://localhost:3000
npm install
npm run dev                     # web en http://localhost:5173
```

`.env.local` (copia de `.env.example`):

| Variable | Para qué |
|---|---|
| `API_URL` | URL de la API. Solo la usa el servidor de Next. |
| `SITE_URL` | URL pública de la web (canónicas, sitemap, Open Graph). Debe coincidir con `APP_URL` del backend, que arma los enlaces de los correos (`/verify-email`, `/reset-password`, `/invite`, `/device`). |

Otros comandos: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm run sdk` (regenera los tipos de la API).

## Dónde cambiar cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Textos de la landing | `src/content/landing.ts`, `faq.ts`, `plans.ts`, `site.ts` |
| Textos del panel, onboarding y cuenta | `src/content/panel.ts`, `company.ts`, `onboarding.ts`, `auth.ts` |
| Mensajes de error de la API (`EMAIL_NOT_VERIFIED`, `SEATS_EXCEEDED`…) | `src/content/errors.ts` |
| Recursos de crisis del pie | `src/content/crisis.ts` (verificar con la psicóloga) |
| Privacidad y términos | `src/content/legal.ts` (borrador para revisión legal) |
| Colores, tipografía y espacios | `src/styles/tokens.css` |
| Texto de las escalas | `src/content/scales.ts` (ver “Licencias”) |

## Arquitectura

```
src/
  app/
    (marketing)/   landing, /precios, /privacidad, /terminos   (estático)
    (auth)/        /login, /registro, /recuperar, /reset-password, /verify-email, /invite
    (onboarding)/  /planes, /plan-corporativo
    (app)/panel/   panel personal       (noindex)
    (app)/empresa/ panel corporativo    (noindex)
    (app)/device/  aprobación de dispositivos (código XXXX-XXXX)
    api/auth/      login, registro, logout y sesión (crean/borran cookies)
    api/backend/   intermediario genérico hacia la API
  features/        un módulo por dominio (hooks de datos + componentes)
  content/         todo el texto, tipado
  components/      ui/ (primitivas sin lógica), marketing/, layout/
  lib/             api/ (cliente tipado), auth/ (sesión), seo/
  styles/          tokens de diseño
  proxy.ts         comprobación optimista de sesión (antes "middleware")
```

**Sesión.** Los tokens viven en cookies `httpOnly`. El navegador nunca los ve: llama a `/api/backend/*` y Next agrega `Authorization`. Cuando vence el access token, Next rota el refresh token. Como la API revoca toda la familia de sesiones si un refresh token se reutiliza, las rotaciones simultáneas se deduplican en memoria (`src/lib/auth/session.ts`). Con varias instancias de Next detrás de un balanceador, usa sesiones persistentes (sticky) o mueve esa deduplicación a Redis.

**Datos.** Cliente tipado con `openapi-fetch` desde `../backend/openapi/openapi.json` (`npm run sdk`). Si la API cambia, el compilador avisa. Las pantallas del panel usan TanStack Query.

**Guards.** `proxy.ts` manda al login si no hay cookie. Dentro, `OnboardingGuard` decide según `onboardingState`: `PLAN_PENDING` lleva a `/planes` y `CORPORATE_PENDING` solo deja ver `/plan-corporativo`. Un `CORPORATE_PLAN_REQUIRED` de la API también redirige ahí.

## Pendientes y decisiones

- **Licencias de escalas:** `src/content/scales.ts` no incluye el texto oficial de los ítems (igual que el backend). Hasta pegarlo, la UI muestra “Pregunta N”. No hay que parafrasear: cambiar las palabras invalida el instrumento.
- **Check-ins desde la web** se registran con `source: "desktop"`, porque la API aún no acepta `"web"` en `POST /checkins` (sí lo acepta en escalas).
- **Límite por IP:** todas las peticiones llegan a la API desde el servidor de Next, que reenvía `X-Forwarded-For`. Para que el límite de `/auth/*` sea por persona, la API debe confiar en el proxy (`app.set("trust proxy", …)` en Express).
- Programas guiados: la pantalla existe y se bloquea por plan, pero aún no hay contenido ni endpoints.
