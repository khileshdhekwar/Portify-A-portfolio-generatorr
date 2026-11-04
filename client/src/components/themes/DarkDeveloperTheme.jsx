import React from 'react';
import { Terminal, GitBranch, ExternalLink, Mail, MapPin, Globe, Github, Linkedin, Twitter, Code2 } from 'lucide-react';

export default function DarkDeveloperTheme({ portfolio, qrCodeUrl }) {
  const p = portfolio || {};
  const info = p.personalInfo || {};

  return (
    <div className="bg-[#0B0F19] text-slate-100 min-h-screen font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
        {/* Terminal Header */}
        <header className="border border-slate-800 rounded-2xl bg-slate-900/60 p-6 sm:p-8 mb-12 shadow-2xl backdrop-blur">
          {/* Terminal Controls */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-3 text-slate-400">portfolio.ts</span>
            </div>
            <span className="hidden sm:inline text-slate-500">Node v24.21.0</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-2">
                <span className="text-slate-500">export default</span>
                <span className="text-indigo-400">class</span>
                <span className="text-emerald-300">Developer</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
                {info.fullName || 'Software Developer'}
              </h1>
              <p className="text-lg text-slate-400 mt-1 font-mono">
                &gt; {info.headline || 'Full Stack Engineer'}
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-400 font-mono mt-4">
                {info.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {info.location}
                  </span>
                )}
                {info.email && (
                  <a href={`mailto:${info.email}`} className="inline-flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    {info.email}
                  </a>
                )}
              </div>
            </div>

            {/* Terminal Actions / Links */}
            <div className="flex flex-wrap md:flex-col gap-2 font-mono text-xs">
              {info.github && (
                <a href={info.github} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors">
                  <span className="flex items-center gap-2"><Github className="w-3.5 h-3.5 text-slate-300" /> github()</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {info.linkedin && (
                <a href={info.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors">
                  <span className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 text-slate-300" /> linkedin()</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {info.website && (
                <a href={info.website} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors">
                  <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-slate-300" /> website()</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Readme Section */}
        {p.summary && (
          <section className="mb-12">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-3">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>// README.md</span>
            </div>
            <div className="p-5 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-300 leading-relaxed text-sm">
              {p.summary}
            </div>
          </section>
        )}

        {/* Git Log / Experience Timeline */}
        {p.experience && p.experience.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-6">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>// git log --graph --career</span>
            </div>
            <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-8">
              {p.experience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B0F19] group-hover:scale-125 transition-transform" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h3 className="text-base font-semibold text-white">
                      {exp.role} <span className="text-emerald-400 font-mono">@ {exp.company}</span>
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      commit {exp.startDate} -&gt; {exp.current ? 'HEAD (Present)' : exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs text-slate-400 mt-1 mb-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-mono select-none">&gt;</span>
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Repositories / Projects */}
        {p.projects && p.projects.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-6">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>// featured_repositories</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {p.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-mono font-bold text-white text-sm">
                        {proj.title}
                      </h4>
                      <div className="flex gap-2 text-xs font-mono">
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                            live
                          </a>
                        )}
                        {proj.repoUrl && (
                          <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:underline">
                            src
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px] pt-3 border-t border-slate-800/80">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tech Stack / Skills */}
        {p.skills && p.skills.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-4">
              <span>// dependencies &amp; stack</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {p.skills.map((group, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                  <h5 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                    {group.category}
                  </h5>
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                    {group.items.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-1 bg-slate-800 text-emerald-300 rounded border border-slate-700/80">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {p.education && p.education.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-4">
              <span>// academic_credentials</span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {p.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row justify-between gap-1">
                  <div>
                    <span className="text-white font-semibold">{edu.degree}</span> in {edu.fieldOfStudy}
                    <div className="text-slate-400 mt-0.5">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                  </div>
                  <span className="text-slate-500">{edu.graduationDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QR Code */}
        {qrCodeUrl && (
          <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <h4 className="text-xs text-emerald-400 uppercase tracking-wider">digital_identity_qr</h4>
              <p className="text-xs text-slate-400 mt-1">Scan to inspect portfolio on mobile client</p>
            </div>
            <img src={qrCodeUrl} alt="QR" className="w-20 h-20 p-1 bg-white rounded-lg border border-slate-700 shrink-0" />
          </section>
        )}
      </main>
    </div>
  );
}
