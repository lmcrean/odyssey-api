using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CompetitorAnalysis.Observability.Extensions;
using CompetitorAnalysis.Observability.Models;
using CompetitorAnalysis.Auth.Data;
using CompetitorAnalysis.Auth.Services.Interfaces;
using CompetitorAnalysis.Auth.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework and Auth services
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IUserService, UserService>();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
var issuer = jwtSettings["Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
var audience = jwtSettings["Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

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
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrEmpty(origin)) return false;
            
            // Allow localhost for development
            if (origin.StartsWith("http://localhost:4200") || origin.StartsWith("https://localhost:4200"))
                return true;
            
            // Allow Firebase hosting domains (main and branch deployments)
            if (origin.StartsWith("https://odyssey-466315.web.app") || 
                origin.StartsWith("https://odyssey-466315.firebaseapp.com") ||
                (origin.StartsWith("https://odyssey-466315--") && origin.EndsWith(".web.app")))
                return true;
            
            return false;
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
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

// Add authentication and authorization middleware
app.UseAuthentication();
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