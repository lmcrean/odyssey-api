using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CompetitorAnalysis.Auth.Entities;

namespace CompetitorAnalysis.Auth.Data.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(c => c.Industry)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(c => c.Website)
            .HasMaxLength(500);
            
        builder.Property(c => c.CreatedAt)
            .IsRequired();
            
        builder.Property(c => c.UpdatedAt)
            .IsRequired();
            
        builder.Property(c => c.IsActive)
            .IsRequired()
            .HasDefaultValue(true);
            
        builder.Property(c => c.Plan)
            .IsRequired()
            .HasConversion<string>()
            .HasDefaultValue(SubscriptionPlan.Free);
            
        builder.Property(c => c.MaxUsers)
            .IsRequired()
            .HasDefaultValue(5);

        builder.HasMany(c => c.Users)
            .WithOne(u => u.Company)
            .HasForeignKey(u => u.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(c => c.Name);
    }
}