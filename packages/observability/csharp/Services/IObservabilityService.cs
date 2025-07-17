using CompetitorAnalysis.Observability.Models;

namespace CompetitorAnalysis.Observability.Services;

public interface IObservabilityService
{
    void LogRequest(ApiLogEntry logEntry);
    void LogError(ErrorLogEntry logEntry);
    void LogPerformance(PerformanceLogEntry logEntry);
    void LogInformation(string message, string source, Dictionary<string, object>? metadata = null);
    void LogWarning(string message, string source, Dictionary<string, object>? metadata = null);
    void LogDebug(string message, string source, Dictionary<string, object>? metadata = null);
    
    Task<List<LogEntry>> GetLogsAsync(DateTime? fromDate = null, DateTime? toDate = null, Models.LogLevel? level = null);
    Task<List<LogEntry>> GetLogsBySourceAsync(string source, DateTime? fromDate = null, DateTime? toDate = null);
    Task<Dictionary<string, object>> GetHealthMetricsAsync();
    Task ClearLogsAsync();
}