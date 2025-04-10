using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class RecommenderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RecommenderController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: /Recommender/ItemHybrid?id=123
    [HttpGet("ItemHybrid")]
    public async Task<IActionResult> ItemHybrid([FromQuery] string id)
    {
        var recommendationRow = await _context.MovieDetailsRecommender
            .FirstOrDefaultAsync(r => r.ShowId == id);

        if (recommendationRow == null)
        {
            return NotFound($"No recommendations found for show ID {id}");
        }

        var recommendedIds = new List<string?>
        {
            recommendationRow.RecId1,
            recommendationRow.RecId2,
            recommendationRow.RecId3,
            recommendationRow.RecId4,
            recommendationRow.RecId5,
            recommendationRow.RecId6,
            recommendationRow.RecId7,
            recommendationRow.RecId8,
            recommendationRow.RecId9,
            recommendationRow.RecId10
        };

        var validIds = recommendedIds
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToList();

        var movies = await _context.Movies
            .Where(m => validIds.Contains(m.ShowId))
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
                AverageRating = m.MovieRatings.Any()
                    ? Math.Round(m.MovieRatings.Average(r => r.Rating), 1)
                    : 0
            })
            .ToListAsync();
        return Ok(movies);
    }

    // GET: /Recommender/ItemContent?id=123
    [HttpGet("ItemContent")]
    public async Task<IActionResult> ItemContent([FromQuery] string id)
    {
        var recommendationRow = await _context.ItemContentRecommender
            .FirstOrDefaultAsync(r => r.ShowId == id);

        if (recommendationRow == null)
        {
            return NotFound($"No recommendations found for show ID {id}");
        }

        var recommendedIds = new List<string?>
        {
            recommendationRow.RecId1,
            recommendationRow.RecId2,
            recommendationRow.RecId3,
            recommendationRow.RecId4,
            recommendationRow.RecId5,
            recommendationRow.RecId6,
            recommendationRow.RecId7,
            recommendationRow.RecId8,
            recommendationRow.RecId9,
            recommendationRow.RecId10
        };

        var validIds = recommendedIds
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToList();

        var movies = await _context.Movies
            .Where(m => validIds.Contains(m.ShowId))
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
                AverageRating = m.MovieRatings.Any()
                    ? Math.Round(m.MovieRatings.Average(r => r.Rating), 1)
                    : 0
            })
            .ToListAsync();
        return Ok(movies);
    }

    // GET: /Recommender/SimilarUser?userId=123
    [HttpGet("SimilarUser")]
    public async Task<IActionResult> SimilarUser([FromQuery] int userId)
    {
        var recommendationRow = await _context.SimilarUserRecommender
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recommendationRow == null)
        {
            return NotFound($"No recommendations found for user ID {userId}");
        }

        var recommendedIds = new List<string?>
        {
            recommendationRow.RecId1,
            recommendationRow.RecId2,
            recommendationRow.RecId3,
            recommendationRow.RecId4,
            recommendationRow.RecId5,
            recommendationRow.RecId6,
            recommendationRow.RecId7,
            recommendationRow.RecId8,
            recommendationRow.RecId9,
            recommendationRow.RecId10
        };

        var validIds = recommendedIds
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToList();

        var movies = await _context.Movies
            .Where(m => validIds.Contains(m.ShowId))
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
                AverageRating = m.MovieRatings.Any()
                    ? Math.Round(m.MovieRatings.Average(r => r.Rating), 1)
                    : 0
            })
            .ToListAsync();

        return Ok(movies);
    }

    // GET: /Recommender/SimilarUser?userId=123
    [HttpGet("UserDemographic")]
    public async Task<IActionResult> UserDemographic([FromQuery] int userId)
    {
        var recommendationRow = await _context.UserDemographicRecommender
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recommendationRow == null)
        {
            return NotFound($"No recommendations found for user ID {userId}");
        }

        var recommendedIds = new List<string?>
        {
            recommendationRow.RecId1,
            recommendationRow.RecId2,
            recommendationRow.RecId3,
            recommendationRow.RecId4,
            recommendationRow.RecId5,
            recommendationRow.RecId6,
            recommendationRow.RecId7,
            recommendationRow.RecId8,
            recommendationRow.RecId9,
            recommendationRow.RecId10
        };

        var validIds = recommendedIds
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToList();

        var movies = await _context.Movies
            .Where(m => validIds.Contains(m.ShowId))
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
                AverageRating = m.MovieRatings.Any()
                    ? Math.Round(m.MovieRatings.Average(r => r.Rating), 1)
                    : 0
            })
            .ToListAsync();

        return Ok(movies);
    }

    // GET: UserTopRated?userId=123
    [HttpGet("UserTopRated")]
    public async Task<IActionResult> GetUserTopRated([FromQuery] int userId)
    {
        var topMovies = await _context.MovieRatings
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.Rating)
            .Select(r => r.ShowId)
            .Distinct()
            .Take(3)
            .ToListAsync();

        var movies = await _context.Movies
            .Where(m => topMovies.Contains(m.ShowId))
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
                AverageRating = m.MovieRatings.Any()
                    ? Math.Round(m.MovieRatings.Average(r => r.Rating), 1)
                    : 0
            })
            .ToListAsync();

        return Ok(movies);
    }


}