import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { FileText, Download, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateReport, getMyReports, exportReportPDF } from '../../services/reportingService';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getMyReports();
      if (res && res.data) setReports(res.data);
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (type) => {
    setGenerating(true);
    try {
      await generateReport(type);
      fetchReports();
    } catch (err) {
      console.error('Generate report error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPDF = async (reportId) => {
    try {
      const res = await exportReportPDF(reportId);
      if (res && res.data) {
        alert(`PDF Document Exported: ${res.data.title}`);
      }
    } catch (err) {
      console.error('Export PDF error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
                <FileText className="w-7 h-7 text-emerald-500" /> Automated Reporting & PDF Exporter
              </h1>
              <p className="text-xs text-content-tertiary mt-1">Generate weekly and monthly performance summaries with PDF export</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerate('weekly')}
                disabled={generating}
                className="px-4 py-2.5 rounded-2xl bg-accent-primary text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                + Generate Weekly Report
              </button>
              <button
                onClick={() => handleGenerate('monthly')}
                disabled={generating}
                className="px-4 py-2.5 rounded-2xl bg-accent-primary text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                + Generate Monthly Report
              </button>
            </div>
          </div>

          <GlassCard className="p-6 space-y-4">
            <h3 className="font-extrabold text-base">Generated Reports History</h3>

            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No reports generated yet. Click above to generate your first learning report!</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {reports.map((r) => (
                  <div key={r._id} className="py-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300">
                        {r.reportType}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1">{r.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Generated {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleExportPDF(r._id)}
                      className="px-3.5 py-2 rounded-xl bg-surface-tertiary hover:bg-emerald-50 text-xs font-bold text-content-secondary flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-4 h-4 text-emerald-500" /> Export PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default ReportsPage;
