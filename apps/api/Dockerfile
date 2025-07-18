FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the project files first for better caching
COPY ["apps/api/CompetitorAnalysis.Api.csproj", "apps/api/"]
COPY ["packages/observability/csharp/CompetitorAnalysis.Observability.csproj", "packages/observability/csharp/"]

# Restore dependencies
RUN dotnet restore "apps/api/CompetitorAnalysis.Api.csproj"

# Copy the entire source code
COPY apps/api/ apps/api/
COPY packages/observability/csharp/ packages/observability/csharp/

# Build the application
WORKDIR "/src/apps/api"
RUN dotnet build "CompetitorAnalysis.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CompetitorAnalysis.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CompetitorAnalysis.Api.dll"]

# Configure for Google Cloud Run
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production