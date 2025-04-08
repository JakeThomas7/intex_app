using System.ComponentModel.DataAnnotations;

namespace intex_app.API.Data
{
    public class Movie
    {
        [Key]
        public string ShowId { get; set; } = Guid.NewGuid().ToString();
        public string? Type { get; set; }
        public string? Title { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public string? Country { get; set; }
        public Int16? ReleaseYear { get; set; }
        public string? Rating { get; set; }
        public string? Duration { get; set; }
        public string? Description { get; set; }
        
        public ICollection<MovieGenre> MovieGenres { get; set; }
    }
    
    public class CreateMovieDto
    {
        [Key]
        public string ShowId { get; set; }
        public string? Type { get; set; }
        public string? Title { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public string? Country { get; set; }
        public Int16? ReleaseYear { get; set; }
        public string? Rating { get; set; }
        public string? Duration { get; set; }
        public string? Description { get; set; }
        
        public List<int>? GenreIds { get; set; }
    }
}