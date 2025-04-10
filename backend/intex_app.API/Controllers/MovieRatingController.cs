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
            return BadRequest("Invalid rating.");

        // Get the authenticated user's UserId from claims
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("User not authenticated.");

        int userId = int.Parse(userIdClaim); // Ensure it's the correct type, parse if needed

        // Check if the movie exists
        var movieExists = _context.Movies.Any(m => m.ShowId == movieRating.ShowId);
        if (!movieExists)
            return NotFound($"Movie with ShowId '{movieRating.ShowId}' not found.");

        // You now have the userId from the authenticated user
        // Check if the user exists (optional)
        var userExists = _context.MovieUsers.Any(u => u.UserId == userId);
        if (!userExists)
            return NotFound($"User with ID '{userId}' not found.");

        // Look for existing rating
        var existingRating = _context.MovieRatings
            .FirstOrDefault(r => r.ShowId == movieRating.ShowId && r.UserId == userId);

        var newMovieRating = new MovieRating
        {
            ShowId = movieRating.ShowId,
            UserId = userId,  // Use the userId from the claim
            Rating = movieRating.Rating
        };

        if (existingRating == null)
        {
            _context.MovieRatings.Add(newMovieRating);
        }
        else
        {
            existingRating.Rating = newMovieRating.Rating;
        }

        _context.SaveChanges();

        return Ok("Rating saved successfully.");
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

        // Check if user exists
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
        var userRating = _context.MovieRatings
            .Where(r => r.UserId == user.UserId && r.ShowId == ShowId)
            .Select(r => r.Rating)
            .FirstOrDefault();

        // If no rating found, return 0
        if (userRating == 0 && !_context.MovieRatings.Any(r => r.UserId == user.UserId && r.ShowId == ShowId))
        {
            userRating = 0;
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