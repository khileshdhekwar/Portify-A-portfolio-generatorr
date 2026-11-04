import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { THEMES } from '../components/themes/ThemeRenderer';
import ThemeRenderer from '../components/themes/ThemeRenderer';
import {
  Sparkles,
  Upload,
  ArrowRight,
  ShieldCheck,
  Download,
  QrCode,
  Layout,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

// Sample mock data for interactive theme showcase
const DEMO_PORTFOLIO = {
  theme: 'minimal-pro',
  title: 'Elena Rostova — Principal Systems Architect',
  personalInfo: {
    fullName: 'Elena Rostova',
    headline: 'Principal Systems Architect & Distributed Systems Engineer',
    email: 'elena.rostova@engineer.dev',
    phone: '+1 (415) 890-4321',
    location: 'San Francisco, CA',
    website: 'https://elena-rostova.dev',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  summary:
    'Systems architect with 8+ years specializing in fault-tolerant distributed backends, real-time message brokers, and cloud infrastructure processing 50M+ daily events.',
  experience: [
    {
      role: 'Principal Systems Architect',
      company: 'Aether Cloud Systems',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      description: 'Lead engineering for next-generation event mesh architecture.',
      highlights: [
        'Designed multi-region Kafka ingestion pipeline reducing p99 latency by 38%.',
        'Spearheaded Kubernetes zero-downtime cluster migrations across 4 global regions.',
      ],
    },
    {
      role: 'Senior Backend Engineer',
      company: 'Veloce Data Platforms',
      location: 'New York, NY',
      startDate: '2018',
      endDate: '2021',
      current: false,
      description: 'Scaled core real-time analytics engine and distributed storage clusters.',
      highlights: [
        'Re-architected PostgreSQL time-series partitioning saving $140,000 annually.',
      ],
    },
  ],
  education: [
    {
      institution: 'Carnegie Mellon University',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science & Distributed Systems',
      graduationDate: '2018',
      gpa: '3.92',
    },
  ],
  skills: [
    { category: 'Languages', items: ['Go', 'Rust', 'TypeScript', 'Python', 'SQL'] },
    { category: 'Infrastructure', items: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Kafka'] },
    { category: 'Databases', items: ['PostgreSQL', 'Redis', 'Cassandra', 'ClickHouse'] },
  ],
  projects: [
    {
      title: 'AuraMesh Distributed Broker',
      description: 'Ultra-low latency Raft consensus distributed key-value storage engine in Go.',
      technologies: ['Go', 'Raft', 'gRPC', 'Prometheus'],
      liveUrl: 'https://github.com',
      repoUrl: 'https://github.com',
    },
  ],
};

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [activeTheme, setActiveTheme] = useState('minimal-pro');

  const previewPortfolio = { ...DEMO_PORTFOLIO, theme: activeTheme };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Powered Resume to Portfolio Builder</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            Your Resume, Your Identity,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Your Portfolio.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Convert your PDF or DOCX resume into an editable, interactive personal portfolio website in seconds. Five handcrafted themes, custom slugs, QR sharing, and standalone ZIP exports.
          </p>

          {/* Primary Call to Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? '/upload' : '/register'}>
              <Button size="lg" variant="primary" icon={Upload} className="w-full sm:w-auto shadow-elevated">
                Upload Resume &amp; Generate
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Demo Portfolios
              </Button>
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Grounded Extraction (Zero Hallucinations)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Layout className="w-4 h-4 text-indigo-600" />
              5 Curated Themes + Auto-Rotation
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Download className="w-4 h-4 text-slate-700" />
              Offline Self-Contained ZIP Export
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <QrCode className="w-4 h-4 text-violet-600" />
              Instant Mobile QR Deep Link
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Theme Showcase */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Five Professional Themes. Zero Generic Templates.
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Select any theme below to preview how your extracted resume instantly transforms into a distinct visual identity.
            </p>
          </div>

          {/* Theme Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                  activeTheme === t.id
                    ? 'bg-slate-900 text-white shadow-subtle'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Live Preview Container Window */}
          <div className="border border-slate-300 rounded-2xl shadow-elevated bg-white overflow-hidden max-w-4xl mx-auto">
            {/* Window Frame Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="ml-3 text-xs font-mono text-slate-500">
                  portify.ai/p/elena-rostova ({activeTheme})
                </span>
              </div>
              <Badge variant="indigo" size="sm">
                Live Interactive Preview
              </Badge>
            </div>

            {/* Embedded Portfolio */}
            <div className="max-h-[520px] overflow-y-auto">
              <ThemeRenderer portfolio={previewPortfolio} qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://portify.ai" />
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              How Portify AI Works
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              A frictionless workflow designed to save hours of manual portfolio design and coding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                  1
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">Upload Resume</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Drop your existing PDF or DOCX file. Our engine parses raw text into clean, structured career records.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-indigo-600 font-medium">
                Supports standard ATS formats
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">AI &amp; Rule Extraction</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gemini AI structures your personal info, experience, skills, education, and projects without inventing false qualifications.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-indigo-600 font-medium">
                Strict factual integrity guaranteed
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                  3
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">Live Studio &amp; Share</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fine-tune any field in the live studio. Publish to your unique public link, download a static ZIP website, or share via QR code.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-indigo-600 font-medium">
                Instant public slug &amp; offline ZIP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Build Your Personal Portfolio?
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Upload your resume now and launch your online portfolio in under 30 seconds.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to={isAuthenticated ? '/upload' : '/register'}>
              <Button size="lg" variant="primary" icon={Sparkles}>
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
