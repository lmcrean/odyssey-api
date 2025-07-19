using Microsoft.AspNetCore.Mvc;
using CompetitorAnalysis.Api.Models;
using CompetitorAnalysis.Observability.Services;

namespace CompetitorAnalysis.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IObservabilityService _observabilityService;

    public HealthController(IObservabilityService observabilityService)
    {
        _observabilityService = observabilityService;
    }

    [HttpGet]
    public ActionResult<string> Get()
    {
        _observabilityService.LogInformation("Health check endpoint accessed", "HealthController");
        return Ok("Hello World from C# API!");
    }

    [HttpGet("status")]
    public ActionResult<HealthResponse> GetStatus()
    {
        _observabilityService.LogInformation("Health status endpoint accessed", "HealthController");
        
        var githubToken = Environment.GetEnvironmentVariable("GITHUB_TOKEN");
        var tokenPresent = !string.IsNullOrEmpty(githubToken);
        var tokenStatus = tokenPresent ? "configured" : "not_configured";
        
        var response = new HealthResponse
        {
            Message = "Hello World from Competitor Analysis API",
            Version = "1.0.0",
            Timestamp = DateTime.UtcNow,
            GitHubToken = new GitHubTokenInfo
            {
                Present = tokenPresent,
                Status = tokenStatus
            }
        };

        return Ok(response);
    }
}