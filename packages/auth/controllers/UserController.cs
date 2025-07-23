using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CompetitorAnalysis.Auth.Models;
using CompetitorAnalysis.Auth.Services.Interfaces;

namespace CompetitorAnalysis.Auth.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IPasswordService _passwordService;

    public UserController(IUserService userService, IPasswordService passwordService)
    {
        _userService = userService;
        _passwordService = passwordService;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

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

            return Ok(userDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving profile", error = ex.Message });
        }
    }

    [HttpPut("profile")]
    public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;

            await _userService.UpdateAsync(user);

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

            return Ok(userDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating profile", error = ex.Message });
        }
    }

    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (!_passwordService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Current password is incorrect" });
            }

            if (!_passwordService.ValidatePasswordStrength(request.NewPassword))
            {
                return BadRequest(new { message = "New password does not meet strength requirements" });
            }

            user.PasswordHash = _passwordService.HashPassword(request.NewPassword);
            await _userService.UpdateAsync(user);

            return Ok(new { message = "Password changed successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while changing password", error = ex.Message });
        }
    }
}