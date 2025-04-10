using intex_app.API.Data;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Headline> Headlines { get; set; }
    public DbSet<Traffic> SiteTraffic { get; set; }
    public DbSet<MovieUser> MovieUsers { get; set; }
    public DbSet<MovieUserStreamingService> MovieUserStreamingServices { get; set; }
    public DbSet<StreamingService> StreamingServices { get; set; }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<MovieGenre> MovieGenres { get; set; }
    public DbSet<MovieDetailsRecommender> MovieDetailsRecommender { get; set; }
    public DbSet<ItemContentRecommender> ItemContentRecommender { get; set; }
    public DbSet<SimilarUserRecommender> SimilarUserRecommender { get; set; }
    public DbSet<UserDemographicRecommender> UserDemographicRecommender { get; set; }
    public DbSet<MovieRating> MovieRatings { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Movie-Category many-to-many
        modelBuilder.Entity<MovieGenre>()
            .HasKey(mc => new { mc.ShowId, mc.GenreId });

        modelBuilder.Entity<MovieGenre>()
            .HasOne(mc => mc.Movie)
            .WithMany(m => m.MovieGenres)
            .HasForeignKey(mc => mc.ShowId);

        modelBuilder.Entity<MovieGenre>()
            .HasOne(mc => mc.Genre)
            .WithMany(c => c.MovieGenres)
            .HasForeignKey(mc => mc.GenreId);

        // Set up many-to-many relationship
        modelBuilder.Entity<MovieUserStreamingService>()
            .HasKey(mus => new { mus.UserId, mus.StreamingServiceId });

        modelBuilder.Entity<MovieUserStreamingService>()
            .HasOne(mus => mus.MovieUser)
            .WithMany(mu => mu.MovieUserStreamingServices)
            .HasForeignKey(mus => mus.UserId);

        modelBuilder.Entity<MovieUserStreamingService>()
            .HasOne(mus => mus.StreamingService)
            .WithMany(ss => ss.MovieUserStreamingServices)
            .HasForeignKey(mus => mus.StreamingServiceId);
        
        modelBuilder.Entity<MovieRating>()
            .HasKey(r => new { r.ShowId, r.UserId });

        modelBuilder.Entity<MovieRating>()
            .HasOne(r => r.Movie)
            .WithMany(m => m.MovieRatings)
            .HasForeignKey(r => r.ShowId);

        modelBuilder.Entity<MovieRating>()
            .HasOne(r => r.MovieUser)
            .WithMany(u => u.MovieRatings)
            .HasForeignKey(r => r.UserId);

        // Seed default streaming services
        modelBuilder.Entity<StreamingService>().HasData(
            new StreamingService { StreamingServiceId = 1, Name = "Netflix" },
            new StreamingService { StreamingServiceId = 2, Name = "Amazon Prime" },
            new StreamingService { StreamingServiceId = 3, Name = "Disney+" },
            new StreamingService { StreamingServiceId = 4, Name = "Hulu" },
            new StreamingService { StreamingServiceId = 5, Name = "Max" },
            new StreamingService { StreamingServiceId = 6, Name = "Apple TV+" },
            new StreamingService { StreamingServiceId = 7, Name = "Peacock" },
            new StreamingService { StreamingServiceId = 8, Name = "Paramount+" }
        );
    }
    
}