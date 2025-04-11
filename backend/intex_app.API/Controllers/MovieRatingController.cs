using System.Security.Claims;
using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class MovieRatingController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MovieRatingController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("MakeRating")]
[Authorize]
public IActionResult MakeRating([FromBody] MovieRatingDto movieRating)
{
    if (movieRating == null)
        return BadRequest(new { message = "Invalid rating." });

    // Use the userId passed directly from the frontend (no need for claims-based userId extraction)
    int userId = movieRating.UserId;

    // Check if the movie exists in the database
    var movie = _context.Movies.FirstOrDefault(m => m.ShowId == movieRating.ShowId);
    if (movie == null)
        return NotFound(new { message = $"Movie with ShowId '{movieRating.ShowId}' not found." });

    // Look for an existing rating by this user for this movie
    var existingRating = _context.MovieRatings
        .FirstOrDefault(r => r.ShowId == movieRating.ShowId && r.UserId == userId);

    if (existingRating == null)
    {
        // If no rating exists, add a new rating entry
        var newMovieRating = new MovieRating
        {
            ShowId = movieRating.ShowId,
            UserId = userId,
            Rating = movieRating.Rating
        };

        _context.MovieRatings.Add(newMovieRating);
    }
    else
    {
        // If a rating exists, update the existing rating
        existingRating.Rating = movieRating.Rating;
    }

    // Save the changes to the database
    _context.SaveChanges();

    // Return a JSON response with a success message
    return Ok(new { message = "Rating saved successfully." });
}


    [HttpPost("GetMovieDetailsPage/{ShowId}")]
    [Authorize]
    public IActionResult GetMovieDetailsPage(string ShowId, [FromBody] string email)
    {
        // Fetch movie details with genres and average rating
        var movie = _context.Movies
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
                Genres = m.MovieGenres.Select(mg => new 
                {
                    mg.GenreId,
                    GenreName = mg.Genre.GenreName
                }).ToList(),
                // Calculate the average rating if there are any ratings
                AverageRating = m.MovieRatings.Any() 
                    ? m.MovieRatings.Average(r => r.Rating) 
                    : 0 // Default to 0 if no ratings
            })
            .FirstOrDefault(m => m.ShowId == ShowId);

        if (movie == null)
            return NotFound($"Movie with ID {ShowId} not found.");

        // Check if user exists by email (assuming user needs to be identified by email for fetching ratings)
        var user = _context.MovieUsers
            .Where(u => u.Email == email)
            .Select(u => new 
            {
                u.UserId,
                u.Name,
                u.Email,
            })
            .FirstOrDefault();

        if (user == null)
            return NotFound($"User with email {email} not found.");

        // Fetch user rating for the movie if exists
        int? userRating = _context.MovieRatings
            .Where(r => r.UserId == user.UserId && r.ShowId == ShowId)
            .Select(r => r.Rating)
            .FirstOrDefault();


        // If no rating found, return 0
        if (!_context.MovieRatings.Any(r => r.UserId == user.UserId && r.ShowId == ShowId))
{
    userRating = null; // or use undefined depending on your preference
}


        // Return both movie details, user details, and user rating
        return Ok(new
        {
            Movie = movie,
            User = user,
            UserRating = userRating
        });
    }
}
