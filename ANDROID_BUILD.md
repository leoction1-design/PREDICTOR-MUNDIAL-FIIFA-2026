# Predictor Mundial FIFA 2026 — Empaquetado Android

## Qué se hizo

1. Se instaló Capacitor (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`) sobre el proyecto Vite + React ya existente.
2. Se inicializó con un **applicationId único**: `com.leonardo.fifapredictor2026`
   (distinto de `com.plataforma.ruta` usado por LLEVA, para evitar el conflicto de instalación que ya tuviste antes).
3. Se generó la carpeta nativa `android/` completa (Gradle, AndroidManifest, recursos, etc.) y se sincronizó el build web (`dist/`) dentro de ella.
4. **Los PNG originales (`icon-192.png`, `icon-512.png`, los screenshots) llegaron corruptos dentro del .zip** — el byte de firma PNG estaba reemplazado por un carácter de reemplazo UTF-8 (probablemente un problema al exportar/comprimir el proyecto). No afecta a la app en sí (esos PNG solo se usaban en `manifest.json` para PWA, no dentro del código React), pero no servían como fuente para el ícono nativo. Por eso el ícono de la app Android se regeneró a partir de `public/icon.svg` (que sí estaba intacto), en todas las resoluciones (mdpi a xxxhdpi), incluyendo ícono adaptable, ícono redondo y splash screen con tu color de tema (`#0F172A`).
5. Se detectó y corrigió un `colors.xml` faltante en la plantilla nativa (el `styles.xml` referenciaba `colorPrimary`/`colorPrimaryDark`/`colorAccent` sin que existieran en ningún lado — esto habría roto la compilación).

## Por qué no te entrego el .apk ya compilado

Este entorno de Claude no tiene acceso al Android SDK ni a los repositorios de Google (`dl.google.com`/`maven.google.com` están bloqueados por la configuración de red), que son obligatorios para compilar con Gradle. Puedo dejar **todo el proyecto nativo listo** (como en este .zip), pero el paso final de compilación (`gradlew assembleDebug`) tiene que correr en un entorno con esos accesos. Te dejo dos formas de hacerlo, la primera sin instalar nada:

## Opción A — GitHub Actions (recomendada, no instalas nada)

Ya te dejé el workflow en `.github/workflows/build-apk.yml`. Pasos:

1. Sube este proyecto a tu repo `leoction1-design/PREDICTOR-MUNDIAL-FIIFA-2026` en GitHub (reemplazando el contenido actual, o en una rama nueva).
2. En GitHub, ve a la pestaña **Actions** del repo — el workflow "Build Android APK" corre automáticamente al hacer push a `main`/`master` (o dispáralo manualmente con el botón "Run workflow").
3. Cuando termine (uno o dos minutos), entra al run finalizado y descarga el artefacto **`predictor-mundial-fifa-2026-debug-apk`** — es un .zip que contiene el `app-debug.apk` listo para instalar.
4. Ese APK debug ya se puede instalar directo en cualquier Android (activando "Instalar apps de orígenes desconocidos").

## Opción B — Android Studio en tu computadora

1. Instala Android Studio si no lo tienes, y Node.js.
2. En la raíz del proyecto: `npm install`, luego `npm run build`, luego `npx cap sync android` (esto asegura que `android/` tenga la última versión de la app web; ya lo dejé sincronizado una vez, pero repítelo si modificas `src/`).
3. Abre la carpeta `android/` de este proyecto como proyecto existente ("Open").
4. Deja que Android Studio descargue el SDK/Gradle la primera vez (usa tu propia conexión, sin las restricciones de este entorno).
5. `Build → Build Bundle(s) / APK(s) → Build APK(s)`.
6. El APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`.

## Para publicar en Google Play (a futuro)

El APK debug generado arriba sirve para instalar/probar, pero **no** para subir a Play Store — eso requiere un **build release firmado** con un keystore propio. Si llegas a ese punto, avísame y armamos el keystore y el `assembleRelease` firmado (o mejor, un `.aab` que es lo que pide Play Store actualmente).
