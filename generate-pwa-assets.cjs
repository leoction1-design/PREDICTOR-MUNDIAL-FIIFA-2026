const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateAssets() {
  console.log('Iniciando generación de recursos PWA...');

  const iconSvgPath = path.join(__dirname, 'public', 'icon.svg');
  if (!fs.existsSync(iconSvgPath)) {
    console.error('Error: No se encontró icon.svg en public/');
    process.exit(1);
  }

  // 1. Generar icon-192.png (192x192)
  console.log('Generando icon-192.png...');
  await sharp(iconSvgPath)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, 'public', 'icon-192.png'));
  console.log('✓ icon-192.png generado con éxito.');

  // 2. Generar icon-512.png (512x512)
  console.log('Generando icon-512.png...');
  await sharp(iconSvgPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, 'public', 'icon-512.png'));
  console.log('✓ icon-512.png generado con éxito.');

  // Renderizar logo intermedio para componer en las capturas de pantalla
  const logoBuffer = await sharp(iconSvgPath)
    .resize(256, 256)
    .png()
    .toBuffer();

  // 3. Generar screenshot-mobile.png (640x1136)
  console.log('Generando screenshot-mobile.png...');
  const backgroundSvgMobile = `
  <svg width="640" height="1136" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399" />
        <stop offset="100%" stop-color="#6ee7b7" />
      </linearGradient>
    </defs>
    <rect width="640" height="1136" fill="url(#bg)" />
    
    <!-- Abstract grid -->
    <path d="M 0,0 L 640,1136 M 640,0 L 0,1136" stroke="#1e293b" stroke-width="2" opacity="0.1" />
    <circle cx="320" cy="568" r="300" fill="none" stroke="#1e293b" stroke-width="1.5" opacity="0.2" />
    <circle cx="320" cy="568" r="150" fill="none" stroke="#1e293b" stroke-width="1.5" opacity="0.2" />
    
    <!-- Content -->
    <text x="320" y="650" font-family="system-ui, sans-serif" font-size="38" font-weight="900" fill="url(#textGrad)" text-anchor="middle" letter-spacing="2">2026 FIFA</text>
    <text x="320" y="700" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle">SCORE PREDICT</text>
    <text x="320" y="755" font-family="system-ui, sans-serif" font-size="18" font-weight="500" fill="#94a3b8" text-anchor="middle">Simulador y Predictor del Mundial</text>
    
    <!-- Feature list -->
    <rect x="120" y="820" width="400" height="48" rx="12" fill="#1e293b" opacity="0.6" stroke="#334155" stroke-width="1"/>
    <text x="320" y="848" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#34d399" text-anchor="middle">⚽ Simulación de Partidos en Vivo</text>

    <rect x="120" y="885" width="400" height="48" rx="12" fill="#1e293b" opacity="0.6" stroke="#334155" stroke-width="1"/>
    <text x="320" y="913" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#38bdf8" text-anchor="middle">🏆 Grupos y Play-Offs Interactivos</text>

    <rect x="120" y="950" width="400" height="48" rx="12" fill="#1e293b" opacity="0.6" stroke="#334155" stroke-width="1"/>
    <text x="320" y="978" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#a78bfa" text-anchor="middle">🧠 Análisis de Agente IA Goleadores</text>

    <!-- Phone footer bar mockup -->
    <rect x="240" y="1115" width="160" height="5" rx="2.5" fill="#475569" />
  </svg>
  `;

  await sharp(Buffer.from(backgroundSvgMobile))
    .composite([{ input: logoBuffer, top: 220, left: 192 }])
    .png()
    .toFile(path.join(__dirname, 'public', 'screenshot-mobile.png'));
  console.log('✓ screenshot-mobile.png generado con éxito.');

  // 4. Generar screenshot-desktop.png (1280x800)
  console.log('Generando screenshot-desktop.png...');
  const backgroundSvgDesktop = `
  <svg width="1280" height="800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399" />
        <stop offset="100%" stop-color="#6ee7b7" />
      </linearGradient>
    </defs>
    <rect width="1280" height="800" fill="url(#bg)" />
    
    <!-- Abstract grid -->
    <path d="M 0,0 L 1280,800 M 1280,0 L 0,800" stroke="#1e293b" stroke-width="2" opacity="0.1" />
    <circle cx="640" cy="400" r="350" fill="none" stroke="#1e293b" stroke-width="2" opacity="0.15" />
    
    <!-- Content -->
    <text x="640" y="430" font-family="system-ui, sans-serif" font-size="46" font-weight="900" fill="url(#textGrad)" text-anchor="middle" letter-spacing="3">2026 FIFA</text>
    <text x="640" y="485" font-family="system-ui, sans-serif" font-size="42" font-weight="800" fill="#ffffff" text-anchor="middle">SCORE PREDICT</text>
    <text x="640" y="535" font-family="system-ui, sans-serif" font-size="20" font-weight="500" fill="#94a3b8" text-anchor="middle">Simulador y Predictor Completo del Mundial 2026 para Android</text>
    
    <!-- Highlights grid -->
    <g transform="translate(190, 590)">
      <!-- Badge 1 -->
      <rect x="0" y="0" width="280" height="60" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />
      <text x="140" y="36" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#34d399" text-anchor="middle">⚽ Simulador de Partidos</text>

      <!-- Badge 2 -->
      <rect x="310" y="0" width="280" height="60" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />
      <text x="450" y="36" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#38bdf8" text-anchor="middle">🏆 Eliminatorias y Fases</text>

      <!-- Badge 3 -->
      <rect x="620" y="0" width="280" height="60" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />
      <text x="760" y="36" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#a78bfa" text-anchor="middle">🧠 Análisis de Agente IA</text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(backgroundSvgDesktop))
    .composite([{ input: logoBuffer, top: 120, left: 512 }])
    .png()
    .toFile(path.join(__dirname, 'public', 'screenshot-desktop.png'));
  console.log('✓ screenshot-desktop.png generado con éxito.');

  console.log('🎉 ¡Todos los recursos de PWA han sido generados exitosamente!');
}

generateAssets().catch((err) => {
  console.error('Error durante la generación de recursos:', err);
  process.exit(1);
});
