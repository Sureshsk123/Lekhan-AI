import { ExecutionAggregator } from './ExecutionAggregator.js';
import { ExcelReportManager } from './ExcelReportManager.js';
import { HtmlReportManager } from './HtmlReportManager.js';
import { JsonReportManager } from './JsonReportManager.js';
import { ReportPublisher } from './ReportPublisher.js';
import { ArtifactCollector } from './ArtifactCollector.js';
import { TrendAnalyzer } from './TrendAnalyzer.js';
import { DashboardDataGenerator } from './DashboardDataGenerator.js';
import path from 'path';
import fs from 'fs';

export class ReportManager {
    constructor() {
        this.outputDir = path.join(__dirname, '../reports');
        if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });
        
        this.aggregator = new ExecutionAggregator();
        this.artifactCollector = new ArtifactCollector(this.outputDir);
        this.excelManager = new ExcelReportManager(this.outputDir);
        this.htmlManager = new HtmlReportManager(this.outputDir);
        this.jsonManager = new JsonReportManager(this.outputDir);
        this.publisher = new ReportPublisher();
        this.trendAnalyzer = new TrendAnalyzer(this.outputDir);
        this.dashboardGen = new DashboardDataGenerator();
    }

    addResult(result) {
        this.aggregator.addResult(result);
    }

    async generateAllReports() {
        const data = this.aggregator.getAggregatedPayload();
        
        const htmlPath = await this.htmlManager.generate(data);
        const jsonPath = await this.jsonManager.generate(data);
        const excelPath = await this.excelManager.generate(data);
        
        await this.publisher.publishLocal(htmlPath);
        await this.publisher.publishLocal(jsonPath);
        await this.publisher.publishLocal(excelPath);
        
        return { htmlPath, jsonPath, excelPath };
    }
}