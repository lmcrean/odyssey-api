/**
 * Shared API constants used across the application
 */
export declare const API_MESSAGES: {
    readonly HEALTH: "Hello World from C# API!";
    readonly HEALTH_STATUS: "Hello World from Competitor Analysis API";
    readonly ROOT: "API is running";
};
export declare const API_VERSION = "1.0.0";
export declare const APP_TITLE = "Competitor Analysis Dashboard";
export declare const API_ENDPOINTS: {
    readonly HEALTH: "/api/health";
    readonly HEALTH_STATUS: "/api/health/status";
    readonly ROOT: "/";
};
export declare const DEFAULT_URLS: {
    readonly API: {
        readonly LOCAL: "http://localhost:5000";
        readonly PRODUCTION: "https://competitor-analysis-api-329000596728.us-central1.run.app";
    };
    readonly WEB: {
        readonly LOCAL: "http://localhost:4200";
        readonly PRODUCTION: "https://your-firebase-app.web.app";
    };
};
export declare const TEST_TIMEOUTS: {
    readonly API_RESPONSE: 10000;
    readonly PAGE_LOAD: 30000;
    readonly ELEMENT_VISIBLE: 5000;
};
//# sourceMappingURL=api.constants.d.ts.map