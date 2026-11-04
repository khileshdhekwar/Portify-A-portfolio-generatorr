import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import ThemeRenderer from '../components/themes/ThemeRenderer';
import { Loader2, Briefcase, ExternalLink, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioService.getPublicPortfolio(slug);
        setPortfolio(data);
      } catch (err) {
        setError(err.message || 'This portfolio is either private or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPublicPortfolio();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs text-slate-500 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center p-8 bg-white border border-slate-200 rounded-3xl max-w-md shadow-card">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Portfolio Unavailable</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
            {error || 'This portfolio page does not exist or has been made private by its creator.'}
          </p>
          <Link to="/">
            <Button variant="primary" size="md">
              Build Your Own Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    window.location.href
  )}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Portify Branding Strip */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
            P
          </div>
          <span className="font-medium text-white">Portify AI</span>
          <span className="hidden sm:inline text-slate-500">• Verified Professional Portfolio</span>
        </div>

        <Link
          to="/register"
          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>Create your own free portfolio</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Render Main Selected Theme */}
      <div className="flex-1">
        <ThemeRenderer portfolio={portfolio} qrCodeUrl={qrCodeUrl} />
      </div>
    </div>
  );
}

