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

    // GET: /Recommender/ItemHybrid
    [HttpGet("ItemHybrid")]
    public async Task<IActionResult> ItemHybrid([FromQuery] int id)
    {
        var recommendations = _context.Movies.Find(id);

        return Ok(recommendations);
    }
}