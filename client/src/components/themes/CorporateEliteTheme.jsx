import React from 'react';
import { Mail, MapPin, Phone, Globe, Linkedin, Award, Briefcase, GraduationCap } from 'lucide-react';

export default function CorporateEliteTheme({ portfolio, qrCodeUrl }) {
  const p = portfolio || {};
  const info = p.personalInfo || {};

  return (
    <div className="bg-slate-100 text-slate-900 min-h-screen py-12 px-4 sm:px-8 font-sans selection:bg-slate-300">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-card rounded-xl overflow-hidden">
        {/* Executive Header Banner */}
        <header className="bg-slate-900 text-white p-8 sm:p-12 border-b-4 border-indigo-600">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">Executive Portfolio</span>
              <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white mt-1">
                {info.fullName || 'Executive Candidate'}
              </h1>
              <p className="text-lg text-slate-300 font-medium mt-1">
                {info.headline || 'Senior Technology Executive'}
              </p>
            </div>

            {info.avatarUrl && (
              <img
                src={info.avatarUrl}
                alt={info.fullName}
                className="w-24 h-24 rounded-lg object-cover border-2 border-slate-700 shrink-0"
              />
            )}
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 pt-6 border-t border-slate-800 text-xs text-slate-300">
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
            {info.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                {info.phone}
              </span>
            )}
            {info.linkedin && (
              <a href={info.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
                LinkedIn
              </a>
            )}
            {info.website && (
              <a href={info.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Website
              </a>
            )}
          </div>
        </header>

        <div className="p-8 sm:p-12 space-y-10">
          {/* Executive Summary */}
          {p.summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 mb-3">
                Executive Profile
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed text-justify">
                {p.summary}
              </p>
            </section>
          )}

          {/* Professional Experience */}
          {p.experience && p.experience.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 mb-6">
                <Briefcase className="w-4 h-4 text-indigo-700" />
                <span>Professional Experience</span>
              </div>
              <div className="space-y-8">
                {p.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-indigo-700">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500 font-mono">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-indigo-900 mb-2">
                      {exp.company} {exp.location && `| ${exp.location}`}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1.5">
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

          {/* Education & Qualifications */}
          {p.education && p.education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 mb-4">
                <GraduationCap className="w-4 h-4 text-indigo-700" />
                <span>Education &amp; Credentials</span>
              </div>
              <div className="space-y-3">
                {p.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-xs pb-3 border-b border-slate-100 last:border-0">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{edu.degree}</span> {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      <div className="text-slate-600 mt-0.5">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                    </div>
                    <span className="font-semibold text-slate-500 font-mono">{edu.graduationDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Core Competencies */}
          {p.skills && p.skills.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 mb-4">
                <Award className="w-4 h-4 text-indigo-700" />
                <span>Core Competencies</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {p.skills.flatMap((g) => g.items).map((skill, sIdx) => (
                  <div key={sIdx} className="p-2.5 bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded text-center">
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* QR Code footer */}
          {qrCodeUrl && (
            <footer className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Digital Verification</span>
                <p className="text-xs text-slate-500 mt-0.5">Scan to access the verified online credential</p>
              </div>
              <img src={qrCodeUrl} alt="QR" className="w-20 h-20 p-1 border border-slate-300 rounded shrink-0" />
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

