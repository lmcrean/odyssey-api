using System.Net;
using CompetitorAnalysis.IntegrationTests.Fixtures;
using FluentAssertions;
using Xunit;

namespace CompetitorAnalysis.IntegrationTests.Tests;

public class ApiCorsTests : IClassFixture<TestWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiCorsTests(TestWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Theory]
    [InlineData("http://localhost:4200")]
    [InlineData("https://localhost:4200")]
    public async Task CORS_Allows_Angular_Development_Origins(string origin)
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/health");
        request.Headers.Add("Origin", origin);
        request.Headers.Add("Access-Control-Request-Method", "GET");

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        
        var allowOriginHeader = response.Headers.GetValues("Access-Control-Allow-Origin").FirstOrDefault();
        allowOriginHeader.Should().Be(origin);
    }

    [Fact]
    public async Task CORS_Rejects_Unauthorized_Origins()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/health");
        request.Headers.Add("Origin", "https://malicious-site.com");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        
        var allowOriginHeader = response.Headers.Contains("Access-Control-Allow-Origin");
        allowOriginHeader.Should().BeFalse();
    }

    [Fact]
    public async Task CORS_Allows_Standard_HTTP_Methods()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/health");
        request.Headers.Add("Origin", "http://localhost:4200");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        
        var allowMethodsHeader = response.Headers.GetValues("Access-Control-Allow-Methods").FirstOrDefault();
        allowMethodsHeader.Should().Contain("GET");
    }

    [Fact]
    public async Task CORS_Allows_Standard_Headers()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/health");
        request.Headers.Add("Origin", "http://localhost:4200");
        request.Headers.Add("Access-Control-Request-Method", "GET");
        request.Headers.Add("Access-Control-Request-Headers", "content-type,authorization");

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        
        var allowHeadersHeader = response.Headers.GetValues("Access-Control-Allow-Headers").FirstOrDefault();
        allowHeadersHeader.Should().NotBeNull();
    }
}