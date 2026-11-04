import React from 'react';
import { Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900">
                Portify<span className="text-indigo-600 font-extrabold">.ai</span>
              </span>
              <p className="text-xs text-slate-500">Your Resume, Your Identity, Your Portfolio.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">Platform</Link>
            <Link to="/upload" className="hover:text-slate-900 transition-colors">Upload</Link>
            <Link to="/dashboard" className="hover:text-slate-900 transition-colors">Portfolios</Link>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              Built with Node.js, React, Tailwind &amp; Gemini AI
            </span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Portify AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for high-performing professionals worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}

