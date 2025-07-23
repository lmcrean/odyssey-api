using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CompetitorAnalysis.Auth.Entities;

namespace CompetitorAnalysis.Auth.Data.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasKey(rt => rt.Id);
        
        builder.Property(rt => rt.Token)
            .IsRequired()
            .HasMaxLength(512);
            
        builder.Property(rt => rt.ExpiresAt)
            .IsRequired();
            
        builder.Property(rt => rt.CreatedAt)
            .IsRequired();
            
        builder.Property(rt => rt.IsRevoked)
            .IsRequired()
            .HasDefaultValue(false);
            
        builder.Property(rt => rt.RevokedReason)
            .HasMaxLength(200);

        builder.HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(rt => rt.Token)
            .IsUnique();
            
        builder.HasIndex(rt => rt.UserId);
        
        builder.HasIndex(rt => rt.ExpiresAt);
    }
}