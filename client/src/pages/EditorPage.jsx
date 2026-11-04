import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import { aiService } from '../services/aiService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import ThemeRenderer, { THEMES } from '../components/themes/ThemeRenderer';
import DeviceSwitcher from '../components/preview/DeviceSwitcher';
import QRCodeModal from '../components/dashboard/QRCodeModal';
import {
  Save,
  Download,
  QrCode,
  ExternalLink,
  Sparkles,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Palette,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  Globe,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Active editor tab: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'theme'
  const [activeTab, setActiveTab] = useState('personal');

  // Preview device mode: 'desktop' | 'tablet' | 'mobile'
  const [device, setDevice] = useState('desktop');

  // AI enhancement loading states
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiHighlightLoadingIdx, setAiHighlightLoadingIdx] = useState(null);

  // QR Modal
  const [showQRModal, setShowQRModal] = useState(false);

  // New upload banner
  const [newUploadInfo, setNewUploadInfo] = useState(location.state || null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioService.getPortfolioById(id);
        setPortfolio(data);
      } catch (err) {
        setError(err.message || 'Failed to load portfolio.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  const handleSave = async () => {
    if (!portfolio) return;
    setSaving(true);
    setSaveSuccess(false);
    setError('');

    try {
      const updated = await portfolioService.updatePortfolio(portfolio._id, portfolio);
      setPortfolio(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save portfolio.');
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers for Field Updates ---
  const updatePersonalInfo = (field, value) => {
    setPortfolio((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleSummaryAI = async () => {
    setAiSummaryLoading(true);
    try {
      const res = await aiService.enhanceSummary(
        portfolio.summary,
        portfolio.experience,
        portfolio.skills
      );
      if (res.enhancedText) {
        setPortfolio((prev) => ({ ...prev, summary: res.enhancedText }));
      }
    } catch (err) {
      alert(err.message || 'AI summary enhancement failed.');
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const handleExperienceAI = async (expIndex) => {
    const exp = portfolio.experience[expIndex];
    if (!exp || !exp.highlights || exp.highlights.length === 0) return;

    setAiHighlightLoadingIdx(expIndex);
    try {
      const res = await aiService.enhanceHighlights(exp.role, exp.company, exp.highlights);
      if (res.enhancedHighlights) {
        setPortfolio((prev) => {
          const newExp = [...prev.experience];
          newExp[expIndex].highlights = res.enhancedHighlights;
          return { ...prev, experience: newExp };
        });
      }
    } catch (err) {
      alert(err.message || 'AI highlights enhancement failed.');
    } finally {
      setAiHighlightLoadingIdx(null);
    }
  };

  // Experience array manipulation
  const addExperience = () => {
    setPortfolio((prev) => ({
      ...prev,
      experience: [
        {
          role: 'New Role',
          company: 'Company Name',
          location: '',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          description: '',
          highlights: ['Key responsibility or accomplishment'],
        },
        ...prev.experience,
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setPortfolio((prev) => {
      const newExp = [...prev.experience];
      newExp[index][field] = value;
      return { ...prev, experience: newExp };
    });
  };

  const removeExperience = (index) => {
    setPortfolio((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Education array manipulation
  const addEducation = () => {
    setPortfolio((prev) => ({
      ...prev,
      education: [
        {
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          institution: 'University Name',
          graduationDate: '2020',
          gpa: '',
          highlights: [],
        },
        ...prev.education,
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setPortfolio((prev) => {
      const newEdu = [...prev.education];
      newEdu[index][field] = value;
      return { ...prev, education: newEdu };
    });
  };

  const removeEducation = (index) => {
    setPortfolio((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Projects array manipulation
  const addProject = () => {
    setPortfolio((prev) => ({
      ...prev,
      projects: [
        {
          title: 'New Featured Project',
          description: 'Description of the architecture and functionality.',
          technologies: ['React', 'Node.js', 'Tailwind CSS'],
          liveUrl: '',
          repoUrl: '',
          highlights: [],
        },
        ...prev.projects,
      ],
    }));
  };

  const updateProject = (index, field, value) => {
    setPortfolio((prev) => {
      const newProj = [...prev.projects];
      newProj[index][field] = value;
      return { ...prev, projects: newProj };
    });
  };

  const removeProject = (index) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Download ZIP
  const handleDownloadZip = async () => {
    try {
      await portfolioService.downloadPortfolioZip(portfolio._id, portfolio.slug);
    } catch (err) {
      alert(err.message || 'Error downloading ZIP archive.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs text-slate-500 font-medium">Loading portfolio studio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl max-w-md">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Portfolio Not Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            The requested portfolio could not be found or you do not have permission to edit it.
          </p>
          <Link to="/dashboard">
            <Button variant="primary" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/p/${portfolio.slug}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      {/* Top Studio Navbar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 shadow-subtle">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="truncate max-w-[200px] sm:max-w-[320px]">{portfolio.title}</span>
              <Badge variant="indigo" size="sm">
                {portfolio.theme}
              </Badge>
            </h1>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-mono mt-0.5"
            >
              <span>/p/{portfolio.slug}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Studio Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQRModal(true)}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
            title="Share & QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadZip}
            icon={Download}
            className="hidden sm:inline-flex text-xs"
          >
            Download ZIP
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={saving}
            icon={saveSuccess ? Check : Save}
            className={`text-xs ${saveSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
          >
            {saveSuccess ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Extraction Banner (Shows after new upload) */}
      {newUploadInfo && (
        <div className="bg-indigo-600 text-white px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <Sparkles className="w-4 h-4 text-indigo-200 shrink-0" />
            <span>
              {newUploadInfo.extractionSource === 'ai_gemini'
                ? 'Resume successfully parsed with Google Gemini AI (100% factually grounded).'
                : 'Resume parsed via Portify Deterministic Rule Engine. Strict factual integrity preserved.'}
            </span>
          </div>
          <button
            onClick={() => setNewUploadInfo(null)}
            className="text-indigo-200 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Split-Screen Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Form Controls */}
        <div className="w-full lg:w-[48%] xl:w-[45%] bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex items-center overflow-x-auto border-b border-slate-200 px-4 py-2 gap-1.5 bg-slate-50/80 shrink-0">
            {[
              { id: 'personal', name: 'Profile', icon: User },
              { id: 'summary', name: 'Summary', icon: FileText },
              { id: 'experience', name: 'Experience', icon: Briefcase },
              { id: 'education', name: 'Education', icon: GraduationCap },
              { id: 'skills', name: 'Skills', icon: Wrench },
              { id: 'projects', name: 'Projects', icon: FolderGit2 },
              { id: 'theme', name: 'Themes', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-subtle border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Tab 1: Personal Info */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Personal &amp; Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={portfolio.personalInfo?.fullName || ''}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="e.g. Alex Vance"
                  />
                  <Input
                    label="Professional Headline"
                    value={portfolio.personalInfo?.headline || ''}
                    onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                  />
                  <Input
                    label="Email Address"
                    value={portfolio.personalInfo?.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="alex@domain.com"
                  />
                  <Input
                    label="Phone Number"
                    value={portfolio.personalInfo?.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                  <Input
                    label="Location"
                    value={portfolio.personalInfo?.location || ''}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="City, State / Country"
                  />
                  <Input
                    label="Avatar URL (Optional)"
                    value={portfolio.personalInfo?.avatarUrl || ''}
                    onChange={(e) => updatePersonalInfo('avatarUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pt-4 border-t border-slate-100">
                  Online Presence &amp; Social Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Personal Website"
                    value={portfolio.personalInfo?.website || ''}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    placeholder="https://..."
                  />
                  <Input
                    label="GitHub Profile"
                    value={portfolio.personalInfo?.github || ''}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                  <Input
                    label="LinkedIn Profile"
                    value={portfolio.personalInfo?.linkedin || ''}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                  <Input
                    label="Twitter / X"
                    value={portfolio.personalInfo?.twitter || ''}
                    onChange={(e) => updatePersonalInfo('twitter', e.target.value)}
                    placeholder="https://x.com/..."
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={handleSummaryAI}
                    loading={aiSummaryLoading}
                    icon={Sparkles}
                    className="text-xs"
                  >
                    AI Enhance Summary
                  </Button>
                </div>
                <Input
                  as="textarea"
                  rows={6}
                  value={portfolio.summary || ''}
                  onChange={(e) => setPortfolio({ ...portfolio, summary: e.target.value })}
                  placeholder="A concise, high-impact overview of your expertise and accomplishments..."
                  helperText="AI enhancement refines phrasing with high-impact action verbs without fabricating false details."
                />
              </div>
            )}

            {/* Tab 3: Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Work Experience</h3>
                  <Button variant="outline" size="sm" onClick={addExperience} icon={Plus} className="text-xs">
                    Add Role
                  </Button>
                </div>

                {portfolio.experience?.map((exp, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 font-mono">#{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={() => handleExperienceAI(idx)}
                          loading={aiHighlightLoadingIdx === idx}
                          icon={Sparkles}
                          className="text-[11px] py-1 px-2.5"
                        >
                          AI Polish Highlights
                        </Button>
                        <button
                          onClick={() => removeExperience(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Role / Title"
                        value={exp.role || ''}
                        onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                      />
                      <Input
                        label="Company"
                        value={exp.company || ''}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        value={exp.startDate || ''}
                        onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                      />
                      <Input
                        label="End Date"
                        value={exp.endDate || ''}
                        onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                        placeholder="e.g. Present or Dec 2023"
                      />
                    </div>

                    <Input
                      label="Key Highlights (One per line)"
                      as="textarea"
                      rows={3}
                      value={exp.highlights ? exp.highlights.join('\n') : ''}
                      onChange={(e) =>
                        updateExperience(
                          idx,
                          'highlights',
                          e.target.value.split('\n').filter((l) => l.trim().length > 0)
                        )
                      }
                      placeholder="Enter bullet points..."
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Education */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Education</h3>
                  <Button variant="outline" size="sm" onClick={addEducation} icon={Plus} className="text-xs">
                    Add Education
                  </Button>
                </div>

                {portfolio.education?.map((edu, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 font-mono">#{idx + 1}</span>
                      <button
                        onClick={() => removeEducation(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Degree"
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                        placeholder="e.g. Bachelor of Science"
                      />
                      <Input
                        label="Field of Study"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => updateEducation(idx, 'fieldOfStudy', e.target.value)}
                        placeholder="e.g. Computer Science"
                      />
                      <Input
                        label="Institution"
                        value={edu.institution || ''}
                        onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                        placeholder="e.g. Stanford University"
                      />
                      <Input
                        label="Graduation Date / Year"
                        value={edu.graduationDate || ''}
                        onChange={(e) => updateEducation(idx, 'graduationDate', e.target.value)}
                        placeholder="e.g. 2020"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Categorized Skills
                </h3>

                {portfolio.skills?.map((group, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                    <Input
                      label="Category Name"
                      value={group.category || ''}
                      onChange={(e) => {
                        const newSkills = [...portfolio.skills];
                        newSkills[idx].category = e.target.value;
                        setPortfolio({ ...portfolio, skills: newSkills });
                      }}
                    />
                    <Input
                      label="Skills (comma separated)"
                      value={group.items ? group.items.join(', ') : ''}
                      onChange={(e) => {
                        const newSkills = [...portfolio.skills];
                        newSkills[idx].items = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        setPortfolio({ ...portfolio, skills: newSkills });
                      }}
                      placeholder="React, TypeScript, Node.js, GraphQL"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tab 6: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Featured Projects</h3>
                  <Button variant="outline" size="sm" onClick={addProject} icon={Plus} className="text-xs">
                    Add Project
                  </Button>
                </div>

                {portfolio.projects?.map((proj, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 font-mono">#{idx + 1}</span>
                      <button
                        onClick={() => removeProject(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Input
                      label="Project Title"
                      value={proj.title || ''}
                      onChange={(e) => updateProject(idx, 'title', e.target.value)}
                    />

                    <Input
                      label="Description"
                      as="textarea"
                      rows={2}
                      value={proj.description || ''}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    />

                    <Input
                      label="Technologies (comma separated)"
                      value={proj.technologies ? proj.technologies.join(', ') : ''}
                      onChange={(e) =>
                        updateProject(
                          idx,
                          'technologies',
                          e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                        )
                      }
                      placeholder="React, Vite, Tailwind CSS"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Live Demo URL"
                        value={proj.liveUrl || ''}
                        onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)}
                        placeholder="https://..."
                      />
                      <Input
                        label="Source Code Repo URL"
                        value={proj.repoUrl || ''}
                        onChange={(e) => updateProject(idx, 'repoUrl', e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 7: Theme & Settings */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Theme &amp; Publishing Settings
                </h3>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Select Portfolio Theme
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {THEMES.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setPortfolio({ ...portfolio, theme: t.id })}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          portfolio.theme === t.id
                            ? 'border-indigo-600 bg-indigo-50/60 shadow-subtle ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                          {portfolio.theme === t.id && (
                            <Badge variant="indigo" size="sm">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <Input
                    label="Custom Public URL Slug"
                    value={portfolio.slug || ''}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                      })
                    }
                    helperText={`Public address: ${window.location.origin}/p/${portfolio.slug}`}
                  />

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Public Visibility</span>
                      <p className="text-[11px] text-slate-500">Allow visitors to access via public URL</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={portfolio.isPublished}
                      onChange={(e) =>
                        setPortfolio({ ...portfolio, isPublished: e.target.checked })
                      }
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Live Preview with Device Switcher */}
        <div className="w-full lg:w-[52%] xl:w-[55%] bg-slate-900 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
          {/* Device Switcher Bar */}
          <DeviceSwitcher
            device={device}
            setDevice={setDevice}
            publicUrl={publicUrl}
          />

          {/* Viewport Frame Simulator */}
          <div className="flex-1 bg-slate-950/60 p-4 sm:p-6 overflow-y-auto flex items-start justify-center">
            <div
              className={`bg-white transition-all duration-300 shadow-2xl overflow-hidden ${
                device === 'mobile'
                  ? 'w-[375px] rounded-[36px] border-[8px] border-slate-800 min-h-[667px]'
                  : device === 'tablet'
                  ? 'w-[768px] rounded-2xl border-4 border-slate-800 min-h-[800px]'
                  : 'w-full rounded-xl border border-slate-800'
              }`}
            >
              <ThemeRenderer
                portfolio={portfolio}
                qrCodeUrl={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  publicUrl
                )}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        portfolio={portfolio}
      />
    </div>
  );
}
