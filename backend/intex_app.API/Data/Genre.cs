using System.ComponentModel.DataAnnotations;

namespace intex_app.API.Data;

public class Genre
{
    [Key]
    public int GenreId { get; set; }
    public string? GenreName { get; set; }
        
    public ICollection<MovieGenre> MovieGenres { get; set; }
}