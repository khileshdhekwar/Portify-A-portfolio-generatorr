import api from './api';

export const portfolioService = {
  async getPortfolios() {
    const res = await api.get('/portfolios');
    return res.data.portfolios;
  },

  async getPortfolioById(id) {
    const res = await api.get(`/portfolios/${id}`);
    return res.data.portfolio;
  },

  async updatePortfolio(id, data) {
    const res = await api.put(`/portfolios/${id}`, data);
    return res.data.portfolio;
  },

  async deletePortfolio(id) {
    const res = await api.delete(`/portfolios/${id}`);
    return res.data;
  },

  async getPublicPortfolio(slug) {
    const res = await api.get(`/portfolios/public/${slug}`);
    return res.data.portfolio;
  },

  async getPortfolioQR(id) {
    const res = await api.get(`/portfolios/${id}/qr`);
    return res.data;
  },

  async downloadPortfolioZip(id, slug) {
    const token = localStorage.getItem('portify_token');
    const response = await fetch(`/api/portfolios/${id}/zip`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download ZIP archive.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portify-${slug || 'portfolio'}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

