using CompetitorAnalysis.Observability.Middleware;
using CompetitorAnalysis.Observability.Models;
using CompetitorAnalysis.Observability.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;

namespace CompetitorAnalysis.Observability.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseObservability(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ObservabilityMiddleware>();
    }

    public static IApplicationBuilder UseObservabilityHealthCheck(this IApplicationBuilder app, string path = "/observability/health")
    {
        return app.Use(async (context, next) =>
        {
            if (context.Request.Path.StartsWithSegments(path))
            {
                var observabilityService = context.RequestServices.GetRequiredService<IObservabilityService>();
                var metrics = await observabilityService.GetHealthMetricsAsync();
                
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonSerializer.Serialize(metrics, new JsonSerializerOptions 
                { 
                    WriteIndented = true 
                }));
            }
            else
            {
                await next();
            }
        });
    }

    public static IApplicationBuilder UseObservabilityLogs(this IApplicationBuilder app, string path = "/observability/logs")
    {
        return app.Use(async (context, next) =>
        {
            if (context.Request.Path.StartsWithSegments(path))
            {
                var observabilityService = context.RequestServices.GetRequiredService<IObservabilityService>();
                
                // Parse query parameters
                var fromDateStr = context.Request.Query["from"].FirstOrDefault();
                var toDateStr = context.Request.Query["to"].FirstOrDefault();
                var levelStr = context.Request.Query["level"].FirstOrDefault();
                var source = context.Request.Query["source"].FirstOrDefault();

                DateTime? fromDate = null;
                DateTime? toDate = null;
                Models.LogLevel? level = null;

                if (DateTime.TryParse(fromDateStr, out var parsedFromDate))
                    fromDate = parsedFromDate;

                if (DateTime.TryParse(toDateStr, out var parsedToDate))
                    toDate = parsedToDate;

                if (Enum.TryParse<Models.LogLevel>(levelStr, true, out var parsedLevel))
                    level = parsedLevel;

                var logs = string.IsNullOrEmpty(source) 
                    ? await observabilityService.GetLogsAsync(fromDate, toDate, level)
                    : await observabilityService.GetLogsBySourceAsync(source, fromDate, toDate);

                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonSerializer.Serialize(logs, new JsonSerializerOptions 
                { 
                    WriteIndented = true 
                }));
            }
            else
            {
                await next();
            }
        });
    }
}