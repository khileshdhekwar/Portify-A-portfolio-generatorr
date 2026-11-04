import React from 'react';
import { ExternalLink, Mail, MapPin, Globe, Github, Linkedin, Twitter, Sparkles, ArrowUpRight } from 'lucide-react';

export default function CreativeGradientTheme({ portfolio, qrCodeUrl }) {
  const p = portfolio || {};
  const info = p.personalInfo || {};

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
        {/* Hero Section with soft restrained gradient */}
        <header className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-rose-50/50 border border-indigo-100/70 shadow-subtle mb-14 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Portfolio</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
            {info.fullName || 'Creative Technologist'}
          </h1>
          <p className="text-xl sm:text-2xl text-indigo-950/80 font-medium">
            {info.headline || 'Product Designer & Engineer'}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-slate-600 mt-4">
            {info.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                {info.location}
              </span>
            )}
            {info.email && (
              <a href={`mailto:${info.email}`} className="inline-flex items-center gap-1.5 hover:text-indigo-700 transition-colors">
                <Mail className="w-4 h-4 text-indigo-500" />
                {info.email}
              </a>
            )}
          </div>

          {p.summary && (
            <p className="mt-6 text-slate-700 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              {p.summary}
            </p>
          )}

          {/* Social Links */}
          <div className="flex flex-wrap gap-2.5 mt-8">
            {info.website && (
              <a href={info.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors shadow-subtle">
                <Globe className="w-3.5 h-3.5" /> Visit Site <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
            {info.github && (
              <a href={info.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 rounded-xl text-xs font-medium transition-colors shadow-subtle">
                <Github className="w-3.5 h-3.5 text-slate-600" /> GitHub
              </a>
            )}
            {info.linkedin && (
              <a href={info.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 rounded-xl text-xs font-medium transition-colors shadow-subtle">
                <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
              </a>
            )}
            {info.twitter && (
              <a href={info.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 rounded-xl text-xs font-medium transition-colors shadow-subtle">
                <Twitter className="w-3.5 h-3.5 text-sky-500" /> Twitter
              </a>
            )}
          </div>
        </header>

        {/* Featured Projects */}
        {p.projects && p.projects.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
              Featured Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {p.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-card hover:border-indigo-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                  <div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs font-semibold pt-2 border-t border-slate-100">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                          Live Demo <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800">
                          Source Code <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Career Timeline */}
        {p.experience && p.experience.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
              Experience Journey
            </h2>
            <div className="space-y-6">
              {p.experience.map((exp, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {exp.role} <span className="text-indigo-600 font-normal">at {exp.company}</span>
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full w-fit">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-slate-600 mb-3">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5">
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

        {/* Skills & Tools */}
        {p.skills && p.skills.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
              Skills &amp; Capabilities
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {p.skills.flatMap((g) => g.items).map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium shadow-subtle"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {p.education && p.education.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
              Education
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {p.education.map((edu, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-semibold text-slate-900 text-sm">{edu.degree}</h4>
                  <p className="text-xs text-indigo-600 font-medium mt-0.5">{edu.fieldOfStudy}</p>
                  <p className="text-xs text-slate-500 mt-2">{edu.institution} • {edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QR Section */}
        {qrCodeUrl && (
          <section className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Scan Portfolio QR</h3>
              <p className="text-xs text-slate-600 mt-1">Directly accessible via mobile or camera</p>
            </div>
            <img src={qrCodeUrl} alt="QR" className="w-20 h-20 bg-white p-1 rounded-xl shadow-subtle border border-indigo-100 shrink-0" />
          </section>
        )}
      </main>
    </div>
  );
}
