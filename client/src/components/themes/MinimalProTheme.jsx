import React from 'react';
import { ExternalLink, Mail, MapPin, Phone, Globe, Github, Linkedin, Twitter } from 'lucide-react';

export default function MinimalProTheme({ portfolio, qrCodeUrl }) {
  const p = portfolio || {};
  const info = p.personalInfo || {};

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-slate-200 selection:text-slate-900">
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
        {/* Header Section */}
        <header className="border-b border-slate-200 pb-12 mb-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900">
                {info.fullName || 'Your Name'}
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 font-light font-serif">
                {info.headline || 'Professional Headline'}
              </p>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-slate-500 pt-2">
                {info.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {info.location}
                  </span>
                )}
                {info.email && (
                  <a href={`mailto:${info.email}`} className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {info.email}
                  </a>
                )}
                {info.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {info.phone}
                  </span>
                )}
              </div>
            </div>

            {info.avatarUrl && (
              <img
                src={info.avatarUrl}
                alt={info.fullName}
                className="w-28 h-28 rounded-full object-cover border border-slate-200 shadow-subtle shrink-0"
              />
            )}
          </div>

          {/* Social Links */}
          {(info.website || info.github || info.linkedin || info.twitter) && (
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-100 text-sm">
              {info.website && (
                <a href={info.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {info.github && (
                <a href={info.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 transition-colors">
                  <Github className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {info.linkedin && (
                <a href={info.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 transition-colors">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {info.twitter && (
                <a href={info.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 transition-colors">
                  <Twitter className="w-3.5 h-3.5" /> Twitter <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>
          )}
        </header>

        {/* Summary */}
        {p.summary && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 font-mono">
              About
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed font-serif">
              {p.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {p.experience && p.experience.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6 font-mono">
              Experience
            </h2>
            <div className="space-y-10">
              {p.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-slate-200 pl-5 relative">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {exp.role}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-3">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Projects */}
        {p.projects && p.projects.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6 font-mono">
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {p.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-5 hover:border-slate-400 transition-colors bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 text-base">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline">
                            Demo <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {proj.repoUrl && (
                          <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 hover:underline">
                            Code <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
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

        {/* Skills */}
        {p.skills && p.skills.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5 font-mono">
              Skills & Expertise
            </h2>
            <div className="space-y-4">
              {p.skills.map((group, idx) => (
                <div key={idx}>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                    {group.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill, sIdx) => (
                      <span key={sIdx} className="text-xs font-mono bg-slate-50 text-slate-800 px-3 py-1 rounded border border-slate-200">
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
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6 font-mono">
              Education
            </h2>
            <div className="space-y-4">
              {p.education.map((edu, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {edu.graduationDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QR Code Deep Link */}
        {qrCodeUrl && (
          <section className="border-t border-slate-200 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-xl">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Scan to View Mobile Portfolio</h3>
              <p className="text-xs text-slate-500 mt-1">
                Scan this QR code with any smartphone camera to view or save this portfolio.
              </p>
            </div>
            <img src={qrCodeUrl} alt="Portfolio QR Code" className="w-24 h-24 bg-white p-1 rounded-lg border border-slate-200 shadow-subtle shrink-0" />
          </section>
        )}
      </main>
    </div>
  );
}

