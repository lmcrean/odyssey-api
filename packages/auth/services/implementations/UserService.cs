using Microsoft.EntityFrameworkCore;
using CompetitorAnalysis.Auth.Data;
using CompetitorAnalysis.Auth.Entities;
using CompetitorAnalysis.Auth.Services.Interfaces;

namespace CompetitorAnalysis.Auth.Services.Implementations;

public class UserService : IUserService
{
    private readonly AuthDbContext _context;
    private readonly IPasswordService _passwordService;

    public UserService(AuthDbContext context, IPasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    public async Task<User?> AuthenticateAsync(string email, string password)
    {
        var user = await _context.Users
            .Include(u => u.Company)
            .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

        if (user == null || !_passwordService.VerifyPassword(password, user.PasswordHash))
            return null;

        return user;
    }

    public async Task<User> RegisterAsync(string email, string password, string firstName, string lastName, string companyName, string industry, string? website = null)
    {
        if (!_passwordService.ValidatePasswordStrength(password))
            throw new ArgumentException("Password does not meet strength requirements");

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (existingUser != null)
            throw new InvalidOperationException("User with this email already exists");

        var company = new Company
        {
            Name = companyName,
            Industry = industry,
            Website = website,
            Plan = SubscriptionPlan.Free,
            MaxUsers = 5
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var user = new User
        {
            Email = email,
            PasswordHash = _passwordService.HashPassword(password),
            FirstName = firstName,
            LastName = lastName,
            CompanyId = company.Id,
            Role = UserRole.CompanyAdmin
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        user.Company = company;
        return user;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.Company)
            .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Company)
            .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
    }

    public async Task UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}