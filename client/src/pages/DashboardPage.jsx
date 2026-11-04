import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import QRCodeModal from '../components/dashboard/QRCodeModal';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import {
  Upload,
  ExternalLink,
  Edit3,
  Download,
  Trash2,
  QrCode,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  Copy,
  Check,
  Briefcase,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [selectedQRPortfolio, setSelectedQRPortfolio] = useState(null);
  const [selectedDeletePortfolio, setSelectedDeletePortfolio] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getPortfolios();
      setPortfolios(data);
    } catch (err) {
      setError(err.message || 'Failed to load portfolios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleDelete = async () => {
    if (!selectedDeletePortfolio) return;
    setDeleteLoading(true);
    try {
      await portfolioService.deletePortfolio(selectedDeletePortfolio._id);
      setPortfolios((prev) => prev.filter((p) => p._id !== selectedDeletePortfolio._id));
      setSelectedDeletePortfolio(null);
    } catch (err) {
      alert(err.message || 'Failed to delete portfolio.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopyLink = (portfolio) => {
    const publicUrl = `${window.location.origin}/p/${portfolio.slug}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedId(portfolio._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadZip = async (portfolio) => {
    try {
      await portfolioService.downloadPortfolioZip(portfolio._id, portfolio.slug);
    } catch (err) {
      alert(err.message || 'Error downloading ZIP.');
    }
  };

  const totalViews = portfolios.reduce((acc, p) => acc + (p.analytics?.views || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header / Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name || 'Professional'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your personal portfolio websites, view analytics, and generate exports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/upload">
              <Button variant="primary" size="md" icon={Upload}>
                Upload New Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-subtle">
            <span className="text-xs text-slate-500 font-medium">Total Portfolios</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{portfolios.length}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Generated from uploaded resumes</span>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-subtle">
            <span className="text-xs text-slate-500 font-medium">Published Live Slugs</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {portfolios.filter((p) => p.isPublished).length}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Publicly accessible worldwide</span>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-subtle">
            <span className="text-xs text-slate-500 font-medium">Total Portfolio Views</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalViews}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Aggregated visitor sessions</span>
          </div>
        </div>

        {/* Portfolio History Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Your Portfolios (History)</h2>
            <span className="text-xs text-slate-500">{portfolios.length} items</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-white border border-slate-200 rounded-2xl animate-pulse p-6" />
              ))}
            </div>
          ) : portfolios.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-6 bg-white border border-dashed border-slate-300 rounded-3xl max-w-xl mx-auto">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No portfolios created yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                Upload your first resume in PDF or DOCX format. Portify AI will extract your career history and generate a personalized website in seconds.
              </p>
              <Link to="/upload">
                <Button variant="primary" size="md" icon={Upload}>
                  Upload Resume Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio._id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shadow-subtle p-6 flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Top Tag Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="indigo" size="sm">
                        {portfolio.theme.replace('-', ' ')}
                      </Badge>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Eye className="w-3.5 h-3.5" />
                        {portfolio.analytics?.views || 0} views
                      </span>
                    </div>

                    {/* Title & Headline */}
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {portfolio.title || 'Professional Portfolio'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {portfolio.personalInfo?.headline || 'Candidate Profile'}
                    </p>

                    {/* Public URL Box */}
                    <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-mono text-slate-600">
                      <span className="truncate">/p/{portfolio.slug}</span>
                      <button
                        onClick={() => handleCopyLink(portfolio)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors shrink-0"
                        title="Copy public link"
                      >
                        {copiedId === portfolio._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-3">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {new Date(portfolio.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link to={`/editor/${portfolio._id}`} className="flex-1">
                      <Button variant="secondary" size="sm" icon={Edit3} className="w-full text-xs">
                        Studio
                      </Button>
                    </Link>

                    <a
                      href={`/p/${portfolio.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                      title="View public live page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => setSelectedQRPortfolio(portfolio)}
                      className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                      title="Share & QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDownloadZip(portfolio)}
                      className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                      title="Download offline ZIP"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedDeletePortfolio(portfolio)}
                      className="p-2 border border-slate-200 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <QRCodeModal
        isOpen={Boolean(selectedQRPortfolio)}
        onClose={() => setSelectedQRPortfolio(null)}
        portfolio={selectedQRPortfolio}
      />

      <DeleteConfirmModal
        isOpen={Boolean(selectedDeletePortfolio)}
        onClose={() => setSelectedDeletePortfolio(null)}
        onConfirm={handleDelete}
        portfolio={selectedDeletePortfolio}
        loading={deleteLoading}
      />
    </div>
  );
}
