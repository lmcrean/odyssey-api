using System.Net;
using System.Text.Json;
using CompetitorAnalysis.Api.Models;
using CompetitorAnalysis.IntegrationTests.Fixtures;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace CompetitorAnalysis.IntegrationTests.Tests;

public class HealthControllerTests : IClassFixture<TestWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;

    public HealthControllerTests(TestWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GET_Health_Returns_HelloWorld_String()
    {
        // Act
        var response = await _client.GetAsync("/api/health");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Be("Hello World from C# API!");
    }

    [Fact]
    public async Task GET_Health_Status_Returns_Structured_Response()
    {
        // Act
        var response = await _client.GetAsync("/api/health/status");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var healthResponse = JsonSerializer.Deserialize<HealthResponse>(content, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        healthResponse.Should().NotBeNull();
        healthResponse!.Message.Should().Be("Hello World from Competitor Analysis API");
        healthResponse.Version.Should().Be("1.0.0");
        healthResponse.Timestamp.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
    }

    [Fact]
    public async Task GET_Root_Returns_API_Running_Message()
    {
        // Act
        var response = await _client.GetAsync("/");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Be("API is running");
    }

    [Fact]
    public async Task GET_Nonexistent_Endpoint_Returns_NotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/nonexistent");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Health_Endpoints_Have_Correct_Content_Type()
    {
        // Act
        var healthResponse = await _client.GetAsync("/api/health");
        var statusResponse = await _client.GetAsync("/api/health/status");

        // Assert
        healthResponse.Content.Headers.ContentType?.MediaType.Should().Be("text/plain");
        statusResponse.Content.Headers.ContentType?.MediaType.Should().Be("application/json");
    }

    [Fact]
    public async Task Health_Endpoints_Support_CORS()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/health");
        request.Headers.Add("Origin", "http://localhost:4200");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Headers.Should().ContainSingle(h => h.Key == "Access-Control-Allow-Origin");
    }
}