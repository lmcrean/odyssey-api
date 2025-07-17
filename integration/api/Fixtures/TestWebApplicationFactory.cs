using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CompetitorAnalysis.IntegrationTests.Fixtures;

public class TestWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove any existing logging providers for cleaner test output
            services.AddLogging(builder => builder.ClearProviders().AddConsole());
            
            // Add any test-specific services here
            // Example: Replace database with in-memory database
            // services.RemoveAll<DbContext>();
            // services.AddDbContext<TestDbContext>(options => options.UseInMemoryDatabase("TestDb"));
        });

        builder.UseEnvironment("Testing");
    }
}