using Microsoft.AspNetCore.Mvc;
using CompetitorAnalysis.Api.Models;

namespace CompetitorAnalysis.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult<string> Get()
    {
        return Ok("Hello World from C# API!");
    }

    [HttpGet("status")]
    public ActionResult<HealthResponse> GetStatus()
    {
        var response = new HealthResponse
        {
            Message = "Hello World from Competitor Analysis API",
            Version = "1.0.0",
            Timestamp = DateTime.UtcNow
        };

        return Ok(response);
    }
}