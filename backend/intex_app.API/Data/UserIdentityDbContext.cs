using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Data;

public class UserIdentityDbContext : IdentityDbContext<User>
{
    public UserIdentityDbContext(DbContextOptions<UserIdentityDbContext> options) : base(options)
    {
        
    }
    
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
                
            // Configure AdminStatus with default value and check constraint
            entity.Property(e => e.AdminStatus)
                .HasDefaultValue(0)  // Explicit default (redundant since you set it in class, but good for DB)
                .IsRequired();
            
        });
    }
    
}