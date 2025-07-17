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
                "https://lauriecrean-free-38256.web.app",
                "https://lauriecrean-free-38256.firebaseapp.com"
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

// Health check endpoint for Google Cloud Run
app.MapGet("/", () => "API is running");

app.Run();

// Make Program class accessible for testing
public partial class Program { }