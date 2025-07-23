using CompetitorAnalysis.Auth.Entities;

namespace CompetitorAnalysis.Auth.Services.Interfaces;

public interface IUserService
{
    Task<User?> AuthenticateAsync(string email, string password);
    Task<User> RegisterAsync(string email, string password, string firstName, string lastName, string companyName, string industry, string? website = null);
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task UpdateAsync(User user);
}