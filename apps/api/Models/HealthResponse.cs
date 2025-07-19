namespace CompetitorAnalysis.Api.Models;

public class HealthResponse
{
    public string Message { get; set; } = string.Empty;
    public string Version { get; set; } = "1.0.0";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public GitHubTokenInfo GitHubToken { get; set; } = new();
}

public class GitHubTokenInfo
{
    public bool Present { get; set; }
    public string Status { get; set; } = "unknown";
}