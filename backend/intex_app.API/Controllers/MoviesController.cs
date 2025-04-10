using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class MoviesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private const int DefaultPageSize = 10;
    private const int MaxPageSize = 50;

    public MoviesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: /Movies/GetMovies
    [HttpGet("GetMovies")]
    [Authorize]
    public async Task<IActionResult> GetMovies(
        [FromQuery] int pageSize = 10,
        [FromQuery] int pageNum = 1,
        [FromQuery] string? search = null,
        [FromQuery] string[]? genre = null,
        [FromQuery] string? sort = null)
    {
        // Validate page size
        const int maxPageSize = 100;
        if (pageSize > maxPageSize)
            pageSize = maxPageSize;

        // Base query
        var query = _context.Movies.AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(m => m.Title.Contains(search));
        }


        if (genre != null && genre.Length > 0)
        {
            // First filter movies that have ANY of the selected genres
            query = query
                .Where(m => m.MovieGenres.Any(mg => genre.Contains(mg.Genre.GenreName)))
                // Then add a computed column for sorting by match count
                .Select(m => new 
                {
                    Movie = m,
                    MatchCount = m.MovieGenres.Count(mg => genre.Contains(mg.Genre.GenreName))
                })
                // Sort by most matches first, then by other criteria (e.g. release year)
                .OrderByDescending(x => x.MatchCount)
                .ThenBy(x => x.Movie.ReleaseYear)
                // Finally project back to just the movie
                .Select(x => x.Movie);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply ordering and pagination
        var movies = await query
            .OrderByDescending(m => m.ReleaseYear)
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new
            {
                m.ShowId,
                m.Title,
                m.ReleaseYear,
                m.Director,
                m.Cast,
                m.Description,
                m.Duration,
                m.Country,
                m.Type,
                m.Rating,
                m.image_url_suffix,
                // Add other movie properties...
                Genres = m.MovieGenres.Select(mg => new
                {
                    mg.GenreId, // or mg.Genre.Id if it's a navigation property
                    GenreName = mg.Genre.GenreName // or mg.Genre.Name if it's a navigation property
                }).ToList(),
                // Calculate the average rating if there are any ratings
                AverageRating = m.MovieRatings.Any() 
                    ? m.MovieRatings.Average(r => r.Rating) 
                    : (double?)null // Return null if no ratings

            })
            .ToListAsync();

        // Create response object
        var response = new
        {
            TotalCount = totalCount,
            Data = movies
        };

        return Ok(response);
    }

    // [HttpGet("GetMovieById")]
    // [Authorize]
    // public async Task<IActionResult> GetMovieById([FromQuery] string ShowId)
    // {
    //     if (string.IsNullOrWhiteSpace(ShowId))
    //     {
    //         return BadRequest("ShowId is required.");
    //     }

    //     var movie = await _context.Movies
    //         .Where(m => m.ShowId == ShowId)
    //         .Select(m => new
    //         {
    //             m.ShowId,
    //             m.Title,
    //             m.ReleaseYear,
    //             m.Director,
    //             m.Cast,
    //             m.Description,
    //             m.Duration,
    //             m.Country,
    //             m.Type,
    //             m.Rating,
    //             m.image_url_suffix,
    //             Genres = m.MovieGenres.Select(mg => new
    //             {
    //                 mg.GenreId,
    //                 GenreName = mg.Genre.GenreName
    //             }).ToList(),
    //             AverageRating = m.MovieRatings.Any()
    //                 ? Math.Round(m.MovieRatings.Average(r => r.Rating), 1)
    //                 : 0
    //         })
    //         .FirstOrDefaultAsync();

    //     if (movie == null)
    //     {
    //         return NotFound($"No movie found with ShowId: {ShowId}");
    //     }

    //     return Ok(movie);
    // }


    [HttpPost("CreateMovie")]
    [Authorize(Roles = "Admin, Super Admin")]
    public IActionResult CreateMovie([FromBody] CreateMovieDto newMovieDto)
    {
        // Map DTO to MovieUser entity
        var newMovie = new Movie
        {
            Type = newMovieDto.Type,
            Title = newMovieDto.Title,
            Director = newMovieDto.Director,
            Cast = newMovieDto.Cast,
            Country = newMovieDto.Country,
            ReleaseYear = newMovieDto.ReleaseYear,
            Rating = newMovieDto.Rating,
            Duration = newMovieDto.Duration,
            Description = newMovieDto.Description,
            MovieGenres = newMovieDto.GenreIds
                .Select(id => new MovieGenre { GenreId = id })
                .ToList()
        };

        _context.Movies.Add(newMovie);
        _context.SaveChanges();
        return Ok();
    }

    [HttpPut("UpdateMovie/{id}")]
    [Authorize(Roles = "Admin, Super Admin")]
    public IActionResult UpdateMovie(string id, [FromBody] CreateMovieDto updatedMovieDto)
    {
        // Fetch the existing movie along with related MovieGenres
        var existingMovie = _context.Movies
            .Include(m => m.MovieGenres)
            .ThenInclude(mg => mg.Genre) // Include Genre to load associated Genre entities
            .FirstOrDefault(m => m.ShowId == id);

        if (existingMovie == null)
        {
            return NotFound(); // Return 404 if the movie is not found
        }

        // Map the updated data from the DTO to the existing movie entity
        existingMovie.Type = updatedMovieDto.Type;
        existingMovie.Title = updatedMovieDto.Title;
        existingMovie.Director = updatedMovieDto.Director;
        existingMovie.Cast = updatedMovieDto.Cast;
        existingMovie.Country = updatedMovieDto.Country;
        existingMovie.ReleaseYear = updatedMovieDto.ReleaseYear;
        existingMovie.Rating = updatedMovieDto.Rating;
        existingMovie.Duration = updatedMovieDto.Duration;
        existingMovie.Description = updatedMovieDto.Description;

        // Clear the existing genres and add the new ones
        existingMovie.MovieGenres.Clear();
        foreach (var genreId in updatedMovieDto.GenreIds)
        {
            // Ensure the genre exists in the database
            var genre = _context.Genres.FirstOrDefault(g => g.GenreId == genreId);
            if (genre != null)
            {
                existingMovie.MovieGenres.Add(new MovieGenre { Genre = genre });
            }
            else
            {
                // Handle the case where the genre doesn't exist in the database
                return BadRequest($"Genre with ID {genreId} does not exist.");
            }
        }

        // Save changes to the database
        _context.Movies.Update(existingMovie);
        _context.SaveChanges();

        return Ok(); // Return 200 OK after successfully updating the movie
    }


    // DELETE: /Movies/5
    [HttpDelete("DeleteMovie/{id}")]
    [Authorize(Roles = "Admin, Super Admin")]
    public async Task<IActionResult> DeleteMovie(string id)
    {
        var movie = await _context.Movies
            .Include(m => m.MovieGenres)
            .FirstOrDefaultAsync(m => m.ShowId == id);

        if (movie == null)
        {
            return NotFound();
        }

        _context.MovieGenres.RemoveRange(movie.MovieGenres); // remove join entries
        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("GetGenres")]
    [Authorize]
    public IActionResult GetGenres()
    {
        var categories = _context.Genres.ToList();
        return Ok(categories);
    }

    
}
