using intex_app.API.Data;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Headline> Headlines { get; set; }
}