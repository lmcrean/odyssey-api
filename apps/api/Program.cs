using CompetitorAnalysis.Observability.Extensions;
using CompetitorAnalysis.Observability.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add observability services
builder.Services.AddObservability(config =>
{
    config.EnableRequestLogging = true;
    config.EnablePerformanceLogging = true;
    config.EnableErrorLogging = true;
    config.LogToConsole = true;
    config.LogToFile = true;
    config.LogFilePath = "logs/api.log";
    config.MinimumLogLevel = CompetitorAnalysis.Observability.Models.LogLevel.Information;
});

// Add CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200", 
                "https://localhost:4200",
                "https://odyssey-466315.web.app",
                "https://odyssey-466315.firebaseapp.com",
                "https://*.web.app"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");

// Add observability middleware
app.UseObservability();
app.UseObservabilityHealthCheck();
app.UseObservabilityLogs();

app.UseAuthorization();

app.MapControllers();

// Health check endpoints for Google Cloud Run
app.MapGet("/", () => "API is running");
app.MapGet("/health", () => Results.Ok(new 
{
    status = "healthy",
    message = "Hello World from C# API!",
    timestamp = DateTime.UtcNow,
    version = "1.0.0"
}));

app.Run();

// Make Program class accessible for testing
public partial class Program { }