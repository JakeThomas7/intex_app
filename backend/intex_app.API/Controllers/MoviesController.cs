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
    public async Task<IActionResult> GetMovies(
        [FromQuery] int pageSize = 10,
        [FromQuery] int pageNum = 1,
        [FromQuery] string? search = null,
        [FromQuery] string? genre = null)
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


        if (!string.IsNullOrWhiteSpace(genre))
        {
            query = query
                .Where(m => m.MovieGenres
                    .Any(mg => mg.Genre.GenreName == genre));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply ordering and pagination
        var movies = await query
            .OrderBy(m => m.ReleaseYear)
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
                // Add other movie properties...
                Genres = m.MovieGenres.Select(mg => new 
                {
                    mg.GenreId, // or mg.Genre.Id if it's a navigation property
                    GenreName = mg.Genre.GenreName // or mg.Genre.Name if it's a navigation property
                }).ToList()
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
    
    [HttpPost("CreateMovie")]
    [Authorize(Roles="Admin, Super Admin")]
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
    [Authorize(Roles="Admin, Super Admin")]
    public IActionResult UpdateMovie(string id, [FromBody] CreateMovieDto updatedMovieDto)
    {
        // Fetch the existing movie along with related MovieGenres
        var existingMovie = _context.Movies
            .Include(m => m.MovieGenres)
            .ThenInclude(mg => mg.Genre)  // Include Genre to load associated Genre entities
            .FirstOrDefault(m => m.ShowId == id);

        if (existingMovie == null)
        {
            return NotFound();  // Return 404 if the movie is not found
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

        return Ok();  // Return 200 OK after successfully updating the movie
    }
    

    // DELETE: /Movies/5
    [HttpDelete("DeleteMovie/{id}")]
    [Authorize(Roles="Admin, Super Admin")]
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
    public IActionResult GetGenres()
    {
        var categories = _context.Genres.ToList();
        return Ok(categories);
    }
}