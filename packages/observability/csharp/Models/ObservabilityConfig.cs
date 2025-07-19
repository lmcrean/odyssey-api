namespace CompetitorAnalysis.Observability.Models;

public class ObservabilityConfig
{
    public bool EnableRequestLogging { get; set; } = true;
    public bool EnablePerformanceLogging { get; set; } = true;
    public bool EnableErrorLogging { get; set; } = true;
    public bool LogToConsole { get; set; } = true;
    public bool LogToFile { get; set; } = true;
    public string LogFilePath { get; set; } = "logs/app.log";
    public LogLevel MinimumLogLevel { get; set; } = LogLevel.Information;
    public List<string> FilterPatterns { get; set; } = new();
    public List<string> SensitiveHeaders { get; set; } = new() { "Authorization", "Cookie", "X-API-Key" };
    public int MaxLogEntries { get; set; } = 10000;
    public bool EnableHealthCheck { get; set; } = true;
}