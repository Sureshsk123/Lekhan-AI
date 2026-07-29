import {
  generateUserReport,
  exportReportPDF,
  getUserReports
} from '../services/reportingService.js';
import { sendError } from '../utils/responseHandler.js';

export const createReport = async (req, res) => {
  try {
    const { reportType = 'weekly' } = req.body;
    const report = await generateUserReport(req.user, { reportType });

    return res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      data: report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return sendError(res, 500, error.message || 'Failed to generate report');
  }
};

export const exportReportPDFController = async (req, res) => {
  try {
    const { reportId } = req.params;
    const pdfData = await exportReportPDF(reportId, req.user);

    return res.status(200).json({
      success: true,
      message: 'PDF Report document payload exported successfully',
      data: pdfData
    });
  } catch (error) {
    console.error('Error exporting PDF report:', error);
    return sendError(res, 500, error.message || 'Failed to export PDF report');
  }
};

export const fetchUserReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await getUserReports(req.user._id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      success: true,
      message: 'User reports fetched successfully',
      data: result.reports,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return sendError(res, 500, error.message || 'Failed to fetch user reports');
  }
};

export default {
  createReport,
  exportReportPDFController,
  fetchUserReports
};
