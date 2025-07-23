using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using CompetitorAnalysis.Auth.Data;
using CompetitorAnalysis.Auth.Entities;
using CompetitorAnalysis.Auth.Models;
using CompetitorAnalysis.Auth.Services.Interfaces;

namespace CompetitorAnalysis.Auth.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IJwtTokenService _tokenService;
    private readonly AuthDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(
        IUserService userService, 
        IJwtTokenService tokenService, 
        AuthDbContext context,
        IConfiguration configuration)
    {
        _userService = userService;
        _tokenService = tokenService;
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var user = await _userService.AuthenticateAsync(request.Email, request.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "15");
            var refreshTokenExpirationDays = int.Parse(jwtSettings["RefreshTokenExpirationDays"] ?? "7");

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpirationDays)
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                IsActive = user.IsActive,
                CompanyId = user.CompanyId,
                Role = user.Role,
                Company = new CompanyDto
                {
                    Id = user.Company.Id,
                    Name = user.Company.Name,
                    Industry = user.Company.Industry,
                    Website = user.Company.Website,
                    CreatedAt = user.Company.CreatedAt,
                    UpdatedAt = user.Company.UpdatedAt,
                    IsActive = user.Company.IsActive,
                    Plan = user.Company.Plan,
                    MaxUsers = user.Company.MaxUsers
                }
            };

            return Ok(new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = userDto,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var user = await _userService.RegisterAsync(
                request.Email,
                request.Password,
                request.FirstName,
                request.LastName,
                request.CompanyName,
                request.Industry,
                request.Website
            );

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "15");
            var refreshTokenExpirationDays = int.Parse(jwtSettings["RefreshTokenExpirationDays"] ?? "7");

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpirationDays)
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                IsActive = user.IsActive,
                CompanyId = user.CompanyId,
                Role = user.Role
            };

            var companyDto = new CompanyDto
            {
                Id = user.Company.Id,
                Name = user.Company.Name,
                Industry = user.Company.Industry,
                Website = user.Company.Website,
                CreatedAt = user.Company.CreatedAt,
                UpdatedAt = user.Company.UpdatedAt,
                IsActive = user.Company.IsActive,
                Plan = user.Company.Plan,
                MaxUsers = user.Company.MaxUsers
            };

            return Ok(new RegisterResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = userDto,
                Company = companyDto,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
        }
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<RefreshTokenResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var accessToken = await _tokenService.RefreshAccessTokenAsync(request.RefreshToken);
            if (accessToken == null)
            {
                return Unauthorized(new { message = "Invalid or expired refresh token" });
            }

            var newRefreshToken = _tokenService.GenerateRefreshToken();
            
            await _tokenService.RevokeRefreshTokenAsync(request.RefreshToken, "Token refreshed");

            var refreshTokenEntity = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (refreshTokenEntity != null)
            {
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "15");
                var refreshTokenExpirationDays = int.Parse(jwtSettings["RefreshTokenExpirationDays"] ?? "7");

                var newRefreshTokenEntity = new RefreshToken
                {
                    Token = newRefreshToken,
                    UserId = refreshTokenEntity.UserId,
                    ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpirationDays)
                };

                _context.RefreshTokens.Add(newRefreshTokenEntity);
                await _context.SaveChangesAsync();

                return Ok(new RefreshTokenResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
                });
            }

            return Unauthorized(new { message = "Invalid refresh token" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during token refresh", error = ex.Message });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        try
        {
            var refreshTokenHeader = Request.Headers["X-Refresh-Token"].FirstOrDefault();
            if (!string.IsNullOrEmpty(refreshTokenHeader))
            {
                await _tokenService.RevokeRefreshTokenAsync(refreshTokenHeader, "User logout");
            }

            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during logout", error = ex.Message });
        }
    }
}