import React from 'react';
import { ExternalLink, Mail, MapPin, Globe, Github, Linkedin, Twitter, ArrowUpRight, Layers } from 'lucide-react';

export default function ModernGlassTheme({ portfolio, qrCodeUrl }) {
  const p = portfolio || {};
  const info = p.personalInfo || {};

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4 sm:px-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Subtle ambient lighting gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10 space-y-10">
        {/* Glass Hero Header */}
        <header className="p-8 sm:p-12 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-glass">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-indigo-300 mb-3">
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>modern-glass</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {info.fullName || 'Digital Architect'}
              </h1>
              <p className="text-xl sm:text-2xl text-indigo-200/90 font-medium mt-1">
                {info.headline || 'Full Stack Engineer &amp; Designer'}
              </p>
            </div>

            {info.avatarUrl && (
              <img
                src={info.avatarUrl}
                alt={info.fullName}
                className="w-24 h-24 rounded-2xl object-cover border border-white/[0.15] shrink-0"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-400 mt-5">
            {info.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {info.location}
              </span>
            )}
            {info.email && (
              <a href={`mailto:${info.email}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {info.email}
              </a>
            )}
          </div>

          {p.summary && (
            <p className="mt-5 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              {p.summary}
            </p>
          )}

          {/* Social Links */}
          <div className="flex flex-wrap gap-2.5 mt-6 pt-6 border-t border-white/[0.06] text-xs">
            {info.website && (
              <a href={info.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-200 transition-colors">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Website <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {info.github && (
              <a href={info.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-200 transition-colors">
                <Github className="w-3.5 h-3.5 text-slate-300" /> GitHub
              </a>
            )}
            {info.linkedin && (
              <a href={info.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-200 transition-colors">
                <Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn
              </a>
            )}
            {info.twitter && (
              <a href={info.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-200 transition-colors">
                <Twitter className="w-3.5 h-3.5 text-sky-400" /> Twitter
              </a>
            )}
          </div>
        </header>

        {/* Glass Experience Section */}
        {p.experience && p.experience.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4 px-1">
              Experience
            </h2>
            <div className="space-y-4">
              {p.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-white/[0.15] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h3 className="text-base font-semibold text-white">
                      {exp.role} <span className="text-indigo-400 font-normal">@ {exp.company}</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-300 mt-1 mb-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 mt-3">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Glass Projects Grid */}
        {p.projects && p.projects.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4 px-1">
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {p.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                      <div className="flex items-center gap-3 text-xs">
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                            Demo <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                        {proj.repoUrl && (
                          <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                            Code <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] text-indigo-300 border border-white/[0.08]">
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

        {/* Glass Skills */}
        {p.skills && p.skills.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4 px-1">
              Capabilities &amp; Stack
            </h2>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
              <div className="flex flex-wrap gap-2">
                {p.skills.flatMap((g) => g.items).map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-slate-200 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education */}
        {p.education && p.education.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4 px-1">
              Education
            </h2>
            <div className="space-y-3">
              {p.education.map((edu, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex justify-between items-baseline text-xs">
                  <div>
                    <h4 className="font-semibold text-white">{edu.degree} in {edu.fieldOfStudy}</h4>
                    <p className="text-slate-400 mt-0.5">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                  </div>
                  <span className="text-slate-400 font-mono">{edu.graduationDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QR Code */}
        {qrCodeUrl && (
          <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">Live Mobile QR</h4>
              <p className="text-xs text-slate-400 mt-1">Scan to preview on phone</p>
            </div>
            <img src={qrCodeUrl} alt="QR" className="w-20 h-20 bg-white p-1 rounded-xl shrink-0" />
          </section>
        )}
      </main>
    </div>
  );
}

