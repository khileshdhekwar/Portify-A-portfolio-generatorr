const JSZip = require('jszip');
const { generateQRBuffer } = require('./qrService');
const config = require('../config/env');

/**
 * Generate a complete standalone HTML document for the given portfolio and theme
 */
const renderStandaloneHTML = (portfolio, publicUrl) => {
  const p = portfolio;
  const info = p.personalInfo || {};
  const theme = p.theme || 'minimal-pro';
  const primaryColor = p.themeSettings?.primaryColor || '#7c3aed';

  // Base CSS & Tailwind CDN for standalone portability
  const htmlHead = `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(info.fullName || 'Portfolio')} — ${escapeHtml(info.headline || 'Professional')}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .font-serif { font-family: 'Newsreader', serif; }
    ${p.themeSettings?.customCss || ''}
  </style>
  `;

  // Render content according to theme
  let themeBody = '';

  if (theme === 'dark-developer') {
    themeBody = renderDarkDeveloperBody(p, publicUrl, primaryColor);
  } else if (theme === 'creative-gradient') {
    themeBody = renderCreativeGradientBody(p, publicUrl, primaryColor);
  } else if (theme === 'corporate-elite') {
    themeBody = renderCorporateEliteBody(p, publicUrl, primaryColor);
  } else if (theme === 'modern-glass') {
    themeBody = renderModernGlassBody(p, publicUrl, primaryColor);
  } else {
    // Default: Minimal Pro
    themeBody = renderMinimalProBody(p, publicUrl, primaryColor);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${htmlHead}
</head>
<body class="antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
  ${themeBody}
  <footer class="py-12 border-t border-slate-200/50 dark:border-slate-800 text-center text-xs text-slate-500">
    <p>Generated with <a href="${config.clientUrl}" target="_blank" class="font-medium hover:underline text-indigo-600 dark:text-indigo-400">Portify AI</a> — Your Resume, Your Identity, Your Portfolio.</p>
  </footer>
</body>
</html>`;
};

// --- Theme 1: Minimal Pro ---
function renderMinimalProBody(p, publicUrl, primaryColor) {
  const info = p.personalInfo || {};
  return `
  <main class="max-w-4xl mx-auto px-6 py-16 text-slate-900 bg-white min-h-screen">
    <!-- Header -->
    <header class="border-b border-slate-200 pb-12 mb-12">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-serif font-bold tracking-tight text-slate-900">${escapeHtml(info.fullName || 'Your Name')}</h1>
          <p class="text-xl text-slate-600 mt-2 font-light">${escapeHtml(info.headline || 'Professional Headline')}</p>
          <div class="flex flex-wrap gap-y-1 gap-x-4 mt-4 text-sm text-slate-500">
            ${info.location ? `<span>📍 ${escapeHtml(info.location)}</span>` : ''}
            ${info.email ? `<a href="mailto:${escapeHtml(info.email)}" class="hover:text-slate-900 underline">✉️ ${escapeHtml(info.email)}</a>` : ''}
            ${info.phone ? `<span>📞 ${escapeHtml(info.phone)}</span>` : ''}
          </div>
        </div>
        ${info.avatarUrl ? `<img src="${escapeHtml(info.avatarUrl)}" alt="Avatar" class="w-24 h-24 rounded-full object-cover border border-slate-200">` : ''}
      </div>

      <!-- Links -->
      <div class="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-100 text-sm">
        ${info.website ? `<a href="${escapeHtml(info.website)}" target="_blank" class="font-medium hover:underline">Website ↗</a>` : ''}
        ${info.github ? `<a href="${escapeHtml(info.github)}" target="_blank" class="font-medium hover:underline">GitHub ↗</a>` : ''}
        ${info.linkedin ? `<a href="${escapeHtml(info.linkedin)}" target="_blank" class="font-medium hover:underline">LinkedIn ↗</a>` : ''}
        ${info.twitter ? `<a href="${escapeHtml(info.twitter)}" target="_blank" class="font-medium hover:underline">Twitter ↗</a>` : ''}
      </div>
    </header>

    <!-- Summary -->
    ${p.summary ? `
    <section class="mb-14">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">About</h2>
      <p class="text-lg text-slate-700 leading-relaxed font-serif">${escapeHtml(p.summary)}</p>
    </section>
    ` : ''}

    <!-- Experience -->
    ${p.experience && p.experience.length ? `
    <section class="mb-14">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">Experience</h2>
      <div class="space-y-8">
        ${p.experience.map(exp => `
          <div class="border-l-2 border-slate-200 pl-4 py-1">
            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between">
              <h3 class="text-base font-semibold text-slate-900">${escapeHtml(exp.role)}</h3>
              <span class="text-xs text-slate-500 font-mono">${escapeHtml(exp.startDate || '')} — ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}</span>
            </div>
            <p class="text-sm font-medium text-slate-600 mb-2">${escapeHtml(exp.company)} ${exp.location ? `• ${escapeHtml(exp.location)}` : ''}</p>
            ${exp.description ? `<p class="text-sm text-slate-600 mb-2">${escapeHtml(exp.description)}</p>` : ''}
            ${exp.highlights && exp.highlights.length ? `
              <ul class="list-disc list-inside text-sm text-slate-600 space-y-1">
                ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Projects -->
    ${p.projects && p.projects.length ? `
    <section class="mb-14">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">Key Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${p.projects.map(proj => `
          <div class="border border-slate-200 rounded-lg p-5 hover:border-slate-400 transition-colors">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-slate-900">${escapeHtml(proj.title)}</h3>
              <div class="flex gap-2 text-xs">
                ${proj.liveUrl ? `<a href="${escapeHtml(proj.liveUrl)}" target="_blank" class="underline">Demo ↗</a>` : ''}
                ${proj.repoUrl ? `<a href="${escapeHtml(proj.repoUrl)}" target="_blank" class="underline">Code ↗</a>` : ''}
              </div>
            </div>
            <p class="text-sm text-slate-600 mb-3">${escapeHtml(proj.description)}</p>
            ${proj.technologies && proj.technologies.length ? `
              <div class="flex flex-wrap gap-1.5 mt-2">
                ${proj.technologies.map(t => `<span class="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded">${escapeHtml(t)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Skills -->
    ${p.skills && p.skills.length ? `
    <section class="mb-14">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Skills & Competencies</h2>
      <div class="space-y-4">
        ${p.skills.map(skillGroup => `
          <div>
            <h4 class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">${escapeHtml(skillGroup.category)}</h4>
            <div class="flex flex-wrap gap-2">
              ${skillGroup.items.map(s => `<span class="text-xs font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Education -->
    ${p.education && p.education.length ? `
    <section class="mb-14">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">Education</h2>
      <div class="space-y-4">
        ${p.education.map(edu => `
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-semibold text-slate-900">${escapeHtml(edu.degree)} ${edu.fieldOfStudy ? `in ${escapeHtml(edu.fieldOfStudy)}` : ''}</h3>
              <p class="text-sm text-slate-600">${escapeHtml(edu.institution)} ${edu.gpa ? `• GPA: ${escapeHtml(edu.gpa)}` : ''}</p>
            </div>
            <span class="text-xs text-slate-500 font-mono">${escapeHtml(edu.graduationDate || '')}</span>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- QR Code Scan -->
    ${publicUrl ? `
    <section class="border-t border-slate-200 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-6 rounded-xl">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Digital Identity QR Code</h3>
        <p class="text-xs text-slate-500 mt-1">Scan to view the live responsive version of this portfolio.</p>
        <a href="${publicUrl}" target="_blank" class="text-xs text-indigo-600 hover:underline mt-2 inline-block font-mono">${publicUrl}</a>
      </div>
      <img src="qrcode.png" alt="Scan QR" class="w-24 h-24 bg-white p-1 rounded-lg border border-slate-200 shadow-sm" />
    </section>
    ` : ''}
  </main>
  `;
}

// --- Theme 2: Dark Developer ---
function renderDarkDeveloperBody(p, publicUrl, primaryColor) {
  const info = p.personalInfo || {};
  return `
  <main class="max-w-4xl mx-auto px-6 py-16 bg-[#0B0F19] text-slate-100 min-h-screen font-sans">
    <!-- Header Terminal Style -->
    <header class="border border-slate-800 rounded-xl bg-slate-900/60 p-6 mb-12 shadow-2xl backdrop-blur">
      <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/80 text-xs text-slate-500 font-mono">
        <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
        <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
        <span class="ml-2">portfolio.config.ts</span>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span class="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">const dev =</span>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white mt-1 font-mono">${escapeHtml(info.fullName || 'Developer')}</h1>
          <p class="text-lg text-slate-400 mt-1">${escapeHtml(info.headline || 'Software Engineer')}</p>
          <div class="flex flex-wrap gap-4 mt-3 text-xs text-slate-400 font-mono">
            ${info.location ? `<span>📍 ${escapeHtml(info.location)}</span>` : ''}
            ${info.email ? `<a href="mailto:${escapeHtml(info.email)}" class="hover:text-emerald-400">✉️ ${escapeHtml(info.email)}</a>` : ''}
          </div>
        </div>
        <div class="flex flex-wrap gap-2 font-mono text-xs">
          ${info.github ? `<a href="${escapeHtml(info.github)}" target="_blank" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">github() ↗</a>` : ''}
          ${info.linkedin ? `<a href="${escapeHtml(info.linkedin)}" target="_blank" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">linkedin() ↗</a>` : ''}
          ${info.website ? `<a href="${escapeHtml(info.website)}" target="_blank" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">site() ↗</a>` : ''}
        </div>
      </div>
    </header>

    <!-- Summary -->
    ${p.summary ? `
    <section class="mb-12">
      <div class="font-mono text-xs text-slate-500 mb-2">// README.md</div>
      <div class="p-5 rounded-lg bg-slate-900/40 border border-slate-800 text-slate-300 leading-relaxed text-sm">
        ${escapeHtml(p.summary)}
      </div>
    </section>
    ` : ''}

    <!-- Experience Timeline -->
    ${p.experience && p.experience.length ? `
    <section class="mb-12">
      <div class="font-mono text-xs text-slate-500 mb-4">// git log --graph --experience</div>
      <div class="space-y-6 relative border-l border-slate-800 ml-3 pl-6">
        ${p.experience.map(exp => `
          <div class="relative">
            <span class="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B0F19]"></span>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between">
              <h3 class="text-base font-semibold text-white">${escapeHtml(exp.role)} <span class="text-emerald-400">@ ${escapeHtml(exp.company)}</span></h3>
              <span class="text-xs font-mono text-slate-500">${escapeHtml(exp.startDate || '')} -> ${exp.current ? 'HEAD (Present)' : escapeHtml(exp.endDate || '')}</span>
            </div>
            ${exp.description ? `<p class="text-xs text-slate-400 mt-1">${escapeHtml(exp.description)}</p>` : ''}
            ${exp.highlights && exp.highlights.length ? `
              <ul class="mt-2 space-y-1 text-xs text-slate-300">
                ${exp.highlights.map(h => `<li class="flex items-start gap-2"><span class="text-emerald-400 font-mono">></span> <span>${escapeHtml(h)}</span></li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Projects Grid -->
    ${p.projects && p.projects.length ? `
    <section class="mb-12">
      <div class="font-mono text-xs text-slate-500 mb-4">// repositories</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${p.projects.map(proj => `
          <div class="p-5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-colors">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-mono font-bold text-white text-sm">${escapeHtml(proj.title)}</h4>
              <div class="flex gap-2 text-xs font-mono">
                ${proj.liveUrl ? `<a href="${escapeHtml(proj.liveUrl)}" target="_blank" class="text-emerald-400 hover:underline">live</a>` : ''}
                ${proj.repoUrl ? `<a href="${escapeHtml(proj.repoUrl)}" target="_blank" class="text-slate-400 hover:underline">src</a>` : ''}
              </div>
            </div>
            <p class="text-xs text-slate-400 mb-3">${escapeHtml(proj.description)}</p>
            ${proj.technologies && proj.technologies.length ? `
              <div class="flex flex-wrap gap-1.5 font-mono text-[11px]">
                ${proj.technologies.map(t => `<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">${escapeHtml(t)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Skills -->
    ${p.skills && p.skills.length ? `
    <section class="mb-12">
      <div class="font-mono text-xs text-slate-500 mb-4">// tech_stack</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${p.skills.map(group => `
          <div class="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
            <h5 class="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">${escapeHtml(group.category)}</h5>
            <div class="flex flex-wrap gap-1.5 font-mono text-xs">
              ${group.items.map(s => `<span class="px-2 py-1 bg-slate-800 text-emerald-300 rounded border border-slate-700">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}
  </main>
  `;
}

// --- Theme 3: Creative Gradient ---
function renderCreativeGradientBody(p, publicUrl, primaryColor) {
  const info = p.personalInfo || {};
  return `
  <main class="max-w-4xl mx-auto px-6 py-16 text-slate-900 min-h-screen">
    <!-- Header with soft refined gradient background -->
    <header class="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-rose-50/50 border border-indigo-100/60 shadow-subtle mb-12">
      <span class="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full mb-3">Portfolio</span>
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">${escapeHtml(info.fullName || 'Your Name')}</h1>
      <p class="text-xl text-indigo-950 font-medium mt-2">${escapeHtml(info.headline || 'Creative Professional')}</p>
      ${p.summary ? `<p class="mt-4 text-slate-600 max-w-2xl text-base leading-relaxed">${escapeHtml(p.summary)}</p>` : ''}
      <div class="flex flex-wrap gap-3 mt-6">
        ${info.website ? `<a href="${escapeHtml(info.website)}" target="_blank" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800">Visit Website ↗</a>` : ''}
        ${info.github ? `<a href="${escapeHtml(info.github)}" target="_blank" class="px-4 py-2 bg-white text-slate-800 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">GitHub</a>` : ''}
        ${info.linkedin ? `<a href="${escapeHtml(info.linkedin)}" target="_blank" class="px-4 py-2 bg-white text-slate-800 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">LinkedIn</a>` : ''}
      </div>
    </header>

    <!-- Projects Showcase -->
    ${p.projects && p.projects.length ? `
    <section class="mb-14">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Featured Work</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${p.projects.map(proj => `
          <div class="group p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-card transition-all">
            <h3 class="text-lg font-bold text-slate-900 mb-2">${escapeHtml(proj.title)}</h3>
            <p class="text-sm text-slate-600 mb-4">${escapeHtml(proj.description)}</p>
            ${proj.technologies && proj.technologies.length ? `
              <div class="flex flex-wrap gap-1.5 mb-4">
                ${proj.technologies.map(t => `<span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">${escapeHtml(t)}</span>`).join('')}
              </div>
            ` : ''}
            <div class="flex gap-3 text-xs font-semibold">
              ${proj.liveUrl ? `<a href="${escapeHtml(proj.liveUrl)}" target="_blank" class="text-indigo-600 hover:underline">Live Preview ↗</a>` : ''}
              ${proj.repoUrl ? `<a href="${escapeHtml(proj.repoUrl)}" target="_blank" class="text-slate-500 hover:underline">View Source</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Experience -->
    ${p.experience && p.experience.length ? `
    <section class="mb-14">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Career Timeline</h2>
      <div class="space-y-6">
        ${p.experience.map(exp => `
          <div class="p-6 rounded-2xl bg-white border border-slate-200">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-slate-900">${escapeHtml(exp.role)} <span class="text-indigo-600 font-normal">at ${escapeHtml(exp.company)}</span></h3>
              <span class="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">${escapeHtml(exp.startDate || '')} - ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}</span>
            </div>
            ${exp.highlights && exp.highlights.length ? `
              <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 mt-3">
                ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Skills -->
    ${p.skills && p.skills.length ? `
    <section class="mb-14">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Skills & Tools</h2>
      <div class="flex flex-wrap gap-2">
        ${p.skills.flatMap(g => g.items).map(s => `<span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium shadow-subtle">${escapeHtml(s)}</span>`).join('')}
      </div>
    </section>
    ` : ''}
  </main>
  `;
}

// --- Theme 4: Corporate Elite ---
function renderCorporateEliteBody(p, publicUrl, primaryColor) {
  const info = p.personalInfo || {};
  return `
  <main class="max-w-4xl mx-auto px-6 py-16 text-slate-900 bg-white min-h-screen">
    <!-- Executive Header with Navy Accent -->
    <header class="border-b-2 border-slate-900 pb-8 mb-10">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold uppercase tracking-wide text-slate-900">${escapeHtml(info.fullName || 'Your Name')}</h1>
          <p class="text-lg text-slate-700 font-semibold tracking-wide uppercase text-xs mt-1 text-indigo-900">${escapeHtml(info.headline || 'Executive Professional')}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-xs text-slate-600 font-medium">
        ${info.location ? `<span>${escapeHtml(info.location)}</span>` : ''}
        ${info.email ? `<span>${escapeHtml(info.email)}</span>` : ''}
        ${info.phone ? `<span>${escapeHtml(info.phone)}</span>` : ''}
        ${info.linkedin ? `<a href="${escapeHtml(info.linkedin)}" target="_blank" class="hover:underline">LinkedIn Profile</a>` : ''}
      </div>
    </header>

    <!-- Executive Summary -->
    ${p.summary ? `
    <section class="mb-10">
      <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Executive Summary</h2>
      <p class="text-sm text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary)}</p>
    </section>
    ` : ''}

    <!-- Professional Experience -->
    ${p.experience && p.experience.length ? `
    <section class="mb-10">
      <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-4">Professional Experience</h2>
      <div class="space-y-6">
        ${p.experience.map(exp => `
          <div>
            <div class="flex justify-between items-baseline">
              <h3 class="text-sm font-bold text-slate-900">${escapeHtml(exp.role)}</h3>
              <span class="text-xs font-semibold text-slate-600">${escapeHtml(exp.startDate || '')} – ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}</span>
            </div>
            <div class="text-xs font-semibold text-slate-700 mb-2">${escapeHtml(exp.company)} ${exp.location ? `| ${escapeHtml(exp.location)}` : ''}</div>
            ${exp.highlights && exp.highlights.length ? `
              <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1">
                ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Education & Credentials -->
    ${p.education && p.education.length ? `
    <section class="mb-10">
      <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Education & Credentials</h2>
      <div class="space-y-3">
        ${p.education.map(edu => `
          <div class="flex justify-between items-baseline text-xs">
            <div>
              <span class="font-bold text-slate-900">${escapeHtml(edu.degree)}</span> ${edu.fieldOfStudy ? `in ${escapeHtml(edu.fieldOfStudy)}` : ''}
              <div class="text-slate-600">${escapeHtml(edu.institution)} ${edu.gpa ? `| GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
            </div>
            <span class="font-semibold text-slate-500">${escapeHtml(edu.graduationDate || '')}</span>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Core Competencies -->
    ${p.skills && p.skills.length ? `
    <section class="mb-10">
      <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Core Competencies</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        ${p.skills.flatMap(g => g.items).map(s => `<div class="p-1.5 bg-slate-50 border border-slate-200 text-slate-800 font-medium text-center">${escapeHtml(s)}</div>`).join('')}
      </div>
    </section>
    ` : ''}
  </main>
  `;
}

// --- Theme 5: Modern Glass ---
function renderModernGlassBody(p, publicUrl, primaryColor) {
  const info = p.personalInfo || {};
  return `
  <div class="min-h-screen bg-slate-950 text-slate-100 py-16 px-6 relative overflow-hidden font-sans">
    <!-- Ambient backdrops -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

    <main class="max-w-4xl mx-auto relative z-10">
      <!-- Glass Hero Header -->
      <header class="p-8 sm:p-12 rounded-3xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl shadow-glass mb-10">
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-white">${escapeHtml(info.fullName || 'Your Name')}</h1>
        <p class="text-xl text-indigo-300 font-medium mt-2">${escapeHtml(info.headline || 'Digital Creator & Architect')}</p>
        <div class="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
          ${info.location ? `<span>📍 ${escapeHtml(info.location)}</span>` : ''}
          ${info.email ? `<span>✉️ ${escapeHtml(info.email)}</span>` : ''}
        </div>
        ${p.summary ? `<p class="mt-4 text-slate-300 text-sm leading-relaxed max-w-2xl">${escapeHtml(p.summary)}</p>` : ''}
      </header>

      <!-- Glass Experience -->
      ${p.experience && p.experience.length ? `
      <section class="mb-10">
        <h2 class="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Experience</h2>
        <div class="space-y-4">
          ${p.experience.map(exp => `
            <div class="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-lg hover:border-white/[0.18] transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                <h3 class="text-base font-semibold text-white">${escapeHtml(exp.role)} <span class="text-indigo-400">@ ${escapeHtml(exp.company)}</span></h3>
                <span class="text-xs text-slate-400 font-mono">${escapeHtml(exp.startDate || '')} — ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}</span>
              </div>
              ${exp.highlights && exp.highlights.length ? `
                <ul class="list-disc list-inside text-xs text-slate-300 space-y-1 mt-2">
                  ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Glass Projects -->
      ${p.projects && p.projects.length ? `
      <section class="mb-10">
        <h2 class="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${p.projects.map(proj => `
            <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-lg">
              <h4 class="font-bold text-white text-sm mb-1">${escapeHtml(proj.title)}</h4>
              <p class="text-xs text-slate-300 mb-3">${escapeHtml(proj.description)}</p>
              ${proj.technologies && proj.technologies.length ? `
                <div class="flex flex-wrap gap-1.5">
                  ${proj.technologies.map(t => `<span class="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">${escapeHtml(t)}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Glass Skills -->
      ${p.skills && p.skills.length ? `
      <section class="mb-10">
        <h2 class="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Capabilities</h2>
        <div class="flex flex-wrap gap-2">
          ${p.skills.flatMap(g => g.items).map(s => `<span class="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-200 font-medium">${escapeHtml(s)}</span>`).join('')}
        </div>
      </section>
      ` : ''}
    </main>
  </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate a standalone ZIP archive for downloading the complete portfolio website
 * @param {object} portfolio
 * @param {string} publicUrl
 * @returns {Promise<Buffer>}
 */
const generatePortfolioZip = async (portfolio, publicUrl) => {
  const zip = new JSZip();

  // 1. Standalone HTML
  const htmlContent = renderStandaloneHTML(portfolio, publicUrl);
  zip.file('index.html', htmlContent);

  // 2. Generate QR code PNG
  try {
    const qrBuffer = await generateQRBuffer(publicUrl);
    zip.file('qrcode.png', qrBuffer);
  } catch (err) {
    console.warn('[ZIP Service] QR buffer omitted:', err.message);
  }

  // 3. Raw Structured Portfolio Data
  zip.file('portfolio.json', JSON.stringify(portfolio, null, 2));

  // 4. Instructions README
  const readmeContent = `# ${portfolio.personalInfo?.fullName || 'My'} Portfolio Website
Theme: ${portfolio.theme}
Created with Portify AI (https://portify-ai.dev)

## How to use:
1. Double click 'index.html' to open your portfolio directly in any modern browser.
2. To host it for free on the web:
   - GitHub Pages: Push this folder to a GitHub repository, go to Settings -> Pages, and select main branch.
   - Netlify / Vercel: Drag and drop this unzipped folder into Netlify Drop or Vercel dashboard for an instant live URL.
3. 'qrcode.png' links directly to your hosted Portify AI page: ${publicUrl}
`;
  zip.file('README.md', readmeContent);

  return await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
};

module.exports = {
  renderStandaloneHTML,
  generatePortfolioZip,
};
