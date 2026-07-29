import apiClient from './apiClient';

export const generateReport = async (reportType = 'weekly') => {
  const res = await apiClient.post('/reports/generate', { reportType });
  return res.data;
};

export const getMyReports = async (params = {}) => {
  const res = await apiClient.get('/reports/my-reports', { params });
  return res.data;
};

export const exportReportPDF = async (reportId) => {
  const res = await apiClient.get(`/reports/export-pdf/${reportId}`);
  return res.data;
};

export default {
  generateReport,
  getMyReports,
  exportReportPDF
};
