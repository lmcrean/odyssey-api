using System.Text.Json.Serialization;

namespace CompetitorAnalysis.Observability.Models;

public class LogEntry
{
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public LogLevel Level { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string? RequestId { get; set; }
    public string? UserId { get; set; }
    public string? Endpoint { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

public class ApiLogEntry : LogEntry
{
    public string HttpMethod { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public long ResponseTimeMs { get; set; }
    public string? UserAgent { get; set; }
    public string? RemoteIp { get; set; }
}

public class ErrorLogEntry : LogEntry
{
    public string? ExceptionType { get; set; }
    public string? StackTrace { get; set; }
    public string? InnerException { get; set; }
}

public class PerformanceLogEntry : LogEntry
{
    public string Operation { get; set; } = string.Empty;
    public long DurationMs { get; set; }
    public Dictionary<string, object>? PerformanceMetrics { get; set; }
}