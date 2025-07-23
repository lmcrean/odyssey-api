using System.Security.Claims;
using CompetitorAnalysis.Auth.Entities;

namespace CompetitorAnalysis.Auth.Services.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Task<string?> RefreshAccessTokenAsync(string refreshToken);
    Task RevokeRefreshTokenAsync(string refreshToken, string reason);
    ClaimsPrincipal? ValidateToken(string token);
}