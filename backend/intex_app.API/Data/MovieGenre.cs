using System.ComponentModel.DataAnnotations.Schema;

namespace intex_app.API.Data;
public class MovieGenre
{
    [ForeignKey("Movie")]
    public string ShowId { get; set; }
    public Movie Movie { get; set; }

    [ForeignKey("Genre")]
    public int GenreId { get; set; }
    public Genre Genre { get; set; }
}