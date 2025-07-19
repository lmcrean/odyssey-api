using CompetitorAnalysis.Observability.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Text.Json;

namespace CompetitorAnalysis.Observability.Services;

public class ObservabilityService : IObservabilityService
{
    private readonly ILogger<ObservabilityService> _logger;
    private readonly ObservabilityConfig _config;
    private readonly ConcurrentQueue<LogEntry> _logs = new();
    private readonly object _fileLock = new();

    public ObservabilityService(ILogger<ObservabilityService> logger, ObservabilityConfig config)
    {
        _logger = logger;
        _config = config;
        
        EnsureLogDirectoryExists();
    }

    public void LogRequest(ApiLogEntry logEntry)
    {
        if (!_config.EnableRequestLogging || !ShouldLog(logEntry.Level))
            return;

        AddLogEntry(logEntry);
        
        var logMessage = $"🌐 [{logEntry.HttpMethod}] {logEntry.Endpoint} - {logEntry.StatusCode} ({logEntry.ResponseTimeMs}ms)";
        _logger.LogInformation(logMessage);
    }

    public void LogError(ErrorLogEntry logEntry)
    {
        if (!_config.EnableErrorLogging || !ShouldLog(logEntry.Level))
            return;

        AddLogEntry(logEntry);
        
        var logMessage = $"❌ Error: {logEntry.Message}";
        if (!string.IsNullOrEmpty(logEntry.ExceptionType))
            logMessage += $" ({logEntry.ExceptionType})";
            
        _logger.LogError(logMessage);
    }

    public void LogPerformance(PerformanceLogEntry logEntry)
    {
        if (!_config.EnablePerformanceLogging || !ShouldLog(logEntry.Level))
            return;

        AddLogEntry(logEntry);
        
        var logMessage = $"⚡ Performance: {logEntry.Operation} took {logEntry.DurationMs}ms";
        _logger.LogInformation(logMessage);
    }

    public void LogInformation(string message, string source, Dictionary<string, object>? metadata = null)
    {
        var logEntry = new LogEntry
        {
            Level = Models.LogLevel.Information,
            Message = message,
            Source = source,
            Metadata = metadata
        };

        AddLogEntry(logEntry);
        _logger.LogInformation($"ℹ️ [{source}] {message}");
    }

    public void LogWarning(string message, string source, Dictionary<string, object>? metadata = null)
    {
        var logEntry = new LogEntry
        {
            Level = Models.LogLevel.Warning,
            Message = message,
            Source = source,
            Metadata = metadata
        };

        AddLogEntry(logEntry);
        _logger.LogWarning($"⚠️ [{source}] {message}");
    }

    public void LogDebug(string message, string source, Dictionary<string, object>? metadata = null)
    {
        var logEntry = new LogEntry
        {
            Level = Models.LogLevel.Debug,
            Message = message,
            Source = source,
            Metadata = metadata
        };

        AddLogEntry(logEntry);
        _logger.LogDebug($"🔍 [{source}] {message}");
    }

    public async Task<List<LogEntry>> GetLogsAsync(DateTime? fromDate = null, DateTime? toDate = null, Models.LogLevel? level = null)
    {
        return await Task.FromResult(_logs
            .Where(log => 
                (fromDate == null || log.Timestamp >= fromDate) &&
                (toDate == null || log.Timestamp <= toDate) &&
                (level == null || log.Level == level))
            .OrderByDescending(log => log.Timestamp)
            .ToList());
    }

    public async Task<List<LogEntry>> GetLogsBySourceAsync(string source, DateTime? fromDate = null, DateTime? toDate = null)
    {
        return await Task.FromResult(_logs
            .Where(log => 
                log.Source.Equals(source, StringComparison.OrdinalIgnoreCase) &&
                (fromDate == null || log.Timestamp >= fromDate) &&
                (toDate == null || log.Timestamp <= toDate))
            .OrderByDescending(log => log.Timestamp)
            .ToList());
    }

    public async Task<Dictionary<string, object>> GetHealthMetricsAsync()
    {
        var totalLogs = _logs.Count;
        var recentLogs = _logs.Count(log => log.Timestamp > DateTime.UtcNow.AddHours(-1));
        var errorLogs = _logs.Count(log => log.Level == Models.LogLevel.Error);
        var warningLogs = _logs.Count(log => log.Level == Models.LogLevel.Warning);

        var metrics = new Dictionary<string, object>
        {
            ["total_logs"] = totalLogs,
            ["recent_logs_1h"] = recentLogs,
            ["error_logs"] = errorLogs,
            ["warning_logs"] = warningLogs,
            ["last_log_timestamp"] = _logs.Any() ? _logs.Max(log => log.Timestamp) : DateTime.MinValue,
            ["service_uptime"] = DateTime.UtcNow.ToString("O"),
            ["log_levels"] = _logs.GroupBy(log => log.Level)
                .ToDictionary(g => g.Key.ToString(), g => g.Count())
        };

        return await Task.FromResult(metrics);
    }

    public async Task ClearLogsAsync()
    {
        while (_logs.TryDequeue(out _)) { }
        await Task.CompletedTask;
    }

    private void AddLogEntry(LogEntry logEntry)
    {
        if (ShouldFilter(logEntry.Message))
            return;

        _logs.Enqueue(logEntry);

        // Maintain log limit
        while (_logs.Count > _config.MaxLogEntries)
        {
            _logs.TryDequeue(out _);
        }

        // Log to file if enabled
        if (_config.LogToFile)
        {
            LogToFile(logEntry);
        }
    }

    private bool ShouldLog(Models.LogLevel level)
    {
        return level <= _config.MinimumLogLevel;
    }

    private bool ShouldFilter(string message)
    {
        return _config.FilterPatterns.Any(pattern => 
            message.Contains(pattern, StringComparison.OrdinalIgnoreCase));
    }

    private void LogToFile(LogEntry logEntry)
    {
        try
        {
            lock (_fileLock)
            {
                var json = JsonSerializer.Serialize(logEntry, new JsonSerializerOptions 
                { 
                    WriteIndented = false 
                });
                
                var logLine = $"{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss.fff} | {json}{Environment.NewLine}";
                File.AppendAllText(_config.LogFilePath, logLine);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to write log to file");
        }
    }

    private void EnsureLogDirectoryExists()
    {
        var directory = Path.GetDirectoryName(_config.LogFilePath);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }
    }
}