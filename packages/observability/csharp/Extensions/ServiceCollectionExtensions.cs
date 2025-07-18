using CompetitorAnalysis.Observability.Models;
using CompetitorAnalysis.Observability.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CompetitorAnalysis.Observability.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddObservability(this IServiceCollection services, ObservabilityConfig? config = null)
    {
        config ??= new ObservabilityConfig();
        
        services.AddSingleton(config);
        services.AddSingleton<IObservabilityService, ObservabilityService>();
        
        // Configure logging
        services.AddLogging(builder =>
        {
            if (config.LogToConsole)
            {
                builder.AddConsole();
            }
            
            builder.AddDebug();
            builder.SetMinimumLevel(ConvertLogLevel(config.MinimumLogLevel));
        });

        return services;
    }

    public static IServiceCollection AddObservability(this IServiceCollection services, Action<ObservabilityConfig> configureOptions)
    {
        var config = new ObservabilityConfig();
        configureOptions(config);
        
        return services.AddObservability(config);
    }

    private static Microsoft.Extensions.Logging.LogLevel ConvertLogLevel(Models.LogLevel logLevel)
    {
        return logLevel switch
        {
            Models.LogLevel.Error => Microsoft.Extensions.Logging.LogLevel.Error,
            Models.LogLevel.Warning => Microsoft.Extensions.Logging.LogLevel.Warning,
            Models.LogLevel.Information => Microsoft.Extensions.Logging.LogLevel.Information,
            Models.LogLevel.Debug => Microsoft.Extensions.Logging.LogLevel.Debug,
            Models.LogLevel.Trace => Microsoft.Extensions.Logging.LogLevel.Trace,
            _ => Microsoft.Extensions.Logging.LogLevel.Information
        };
    }
}