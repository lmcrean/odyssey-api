using CompetitorAnalysis.Observability.Models;
using CompetitorAnalysis.Observability.Services;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using System.Text;

namespace CompetitorAnalysis.Observability.Middleware;

public class ObservabilityMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IObservabilityService _observabilityService;
    private readonly ObservabilityConfig _config;

    public ObservabilityMiddleware(RequestDelegate next, IObservabilityService observabilityService, ObservabilityConfig config)
    {
        _next = next;
        _observabilityService = observabilityService;
        _config = config;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!_config.EnableRequestLogging)
        {
            await _next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString();
        
        // Add request ID to context
        context.Items["RequestId"] = requestId;

        try
        {
            // Log request start
            _observabilityService.LogDebug(
                $"🔄 Request started: {context.Request.Method} {context.Request.Path}",
                "Middleware",
                new Dictionary<string, object>
                {
                    ["request_id"] = requestId,
                    ["method"] = context.Request.Method,
                    ["path"] = context.Request.Path.Value ?? string.Empty,
                    ["query"] = context.Request.QueryString.Value ?? string.Empty,
                    ["user_agent"] = context.Request.Headers["User-Agent"].FirstOrDefault() ?? string.Empty,
                    ["remote_ip"] = GetClientIpAddress(context)
                }
            );

            await _next(context);

            stopwatch.Stop();

            // Log successful request
            var apiLogEntry = new ApiLogEntry
            {
                Level = Models.LogLevel.Information,
                Message = $"Request completed: {context.Request.Method} {context.Request.Path}",
                Source = "API",
                RequestId = requestId,
                HttpMethod = context.Request.Method,
                Endpoint = context.Request.Path,
                StatusCode = context.Response.StatusCode,
                ResponseTimeMs = stopwatch.ElapsedMilliseconds,
                UserAgent = context.Request.Headers["User-Agent"].FirstOrDefault(),
                RemoteIp = GetClientIpAddress(context),
                Metadata = new Dictionary<string, object>
                {
                    ["query_string"] = context.Request.QueryString.Value ?? string.Empty,
                    ["content_length"] = context.Response.ContentLength ?? 0,
                    ["content_type"] = context.Response.ContentType ?? string.Empty
                }
            };

            _observabilityService.LogRequest(apiLogEntry);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            // Log error
            var errorLogEntry = new ErrorLogEntry
            {
                Level = Models.LogLevel.Error,
                Message = $"Request failed: {context.Request.Method} {context.Request.Path}",
                Source = "API",
                RequestId = requestId,
                Endpoint = context.Request.Path,
                ExceptionType = ex.GetType().Name,
                StackTrace = ex.StackTrace,
                InnerException = ex.InnerException?.Message,
                Metadata = new Dictionary<string, object>
                {
                    ["method"] = context.Request.Method,
                    ["path"] = context.Request.Path.Value ?? string.Empty,
                    ["query"] = context.Request.QueryString.Value ?? string.Empty,
                    ["response_time_ms"] = stopwatch.ElapsedMilliseconds,
                    ["user_agent"] = context.Request.Headers["User-Agent"].FirstOrDefault() ?? string.Empty,
                    ["remote_ip"] = GetClientIpAddress(context)
                }
            };

            _observabilityService.LogError(errorLogEntry);
            
            // Set error status code if not already set
            if (context.Response.StatusCode == 200)
            {
                context.Response.StatusCode = 500;
            }

            throw;
        }
    }

    private string GetClientIpAddress(HttpContext context)
    {
        // Check for forwarded headers first (for load balancers/proxies)
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(realIp))
        {
            return realIp;
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}