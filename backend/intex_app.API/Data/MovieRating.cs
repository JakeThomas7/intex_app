using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace intex_app.API.Data;

public class MovieRating
{
    [ForeignKey("ShowId")]
    public string ShowId { get; set; }
    public Movie Movie { get; set; }
    
    [ForeignKey("MovieUserId")]
    public int UserId { get; set; }
    public MovieUser MovieUser { get; set; }
    
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int Rating { get; set; }
}

public class MovieRatingDto
{
    public int UserId { get; set; }
    public string ShowId { get; set; }
    public int Rating { get; set; }
}