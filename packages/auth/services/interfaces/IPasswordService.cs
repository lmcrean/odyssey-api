namespace CompetitorAnalysis.Auth.Services.Interfaces;

public interface IPasswordService  
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
    bool ValidatePasswordStrength(string password);
}