using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Data;

public class UserIdentityDbContext : IdentityDbContext<User>
{
    public UserIdentityDbContext(DbContextOptions<UserIdentityDbContext> options) : base(options)
    {
        
    }

    public DbSet<UserOtp> UserOtp { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
            
        // Custom configurations for User
        builder.Entity<User>(entity =>
        {
            // Configure string properties
            entity.Property(e => e.FirstName)
                .HasMaxLength(100);  // Limit first name length
                
            entity.Property(e => e.LastName)
                .HasMaxLength(100);  // Limit last name length
            
        });
        
        builder.Entity<IdentityRole>().HasData(
            new IdentityRole
            {
                Id = "3",
                Name = "Super Admin",
                NormalizedName = "SUPER ADMIN"
            },
            new IdentityRole
            {
                Id = "2",
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Id = "1",
                Name = "User",
                NormalizedName = "USER"
            }
        );
    }
    
}