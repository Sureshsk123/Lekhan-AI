export class DashboardDataGenerator {
    generatePayload(aggregatedData) {
        // Normalizes data for DataDog / ElasticSearch / Kibana ingestion
        return {
            timestamp: aggregatedData.executionEnd,
            tags: ['mobile', 'regression'],
            metrics: {
                passRate: (aggregatedData.passed / aggregatedData.totalTests) * 100,
                duration: aggregatedData.totalDurationMs
            }
        };
    }
}