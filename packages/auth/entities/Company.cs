namespace CompetitorAnalysis.Auth.Entities;

public class Company
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string? Website { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    
    public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.Free;
    public int MaxUsers { get; set; } = 5;
    
    public ICollection<User> Users { get; set; } = new List<User>();
}