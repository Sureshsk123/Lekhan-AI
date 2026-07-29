import apiClient from './apiClient';

export interface LearningReport {
  id: string;
  reportType: 'weekly' | 'monthly';
  period: string;
  totalXP: number;
  lessonsCompleted: number;
  storiesRead: number;
  accuracyRate: number;
  downloadUrl?: string;
}

export const generateReport = async (reportType: 'weekly' | 'monthly' = 'weekly'): Promise<LearningReport> => {
  const res = await apiClient.post('/reports/generate', { reportType });
  return res.data.report || res.data.data || res.data;
};

export const getMyReports = async (): Promise<LearningReport[]> => {
  const res = await apiClient.get('/reports/my-reports');
  return res.data.reports || res.data.data || [];
};

export const exportReportPDF = async (reportId: string): Promise<{ downloadUrl?: string; pdfBase64?: string }> => {
  const res = await apiClient.get(`/reports/export-pdf/${reportId}`);
  return res.data;
};

export default {
  generateReport,
  getMyReports,
  exportReportPDF,
};
