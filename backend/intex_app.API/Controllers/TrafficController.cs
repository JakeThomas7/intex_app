using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace intex_app.API.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize(Roles="Admin, Super Admin")]
public class TrafficController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public TrafficController(ApplicationDbContext temp)
    {
        _context = temp;
    }

    [HttpGet("GetTraffic")]
    public IActionResult GetTraffic()
    {
        var traffic = _context.SiteTraffic.ToList();
        return Ok(traffic);
    }

    [HttpPost("AddTraffic/{fingerprint}")]
    public IActionResult AddTraffic(string fingerprint)
    {
        var traffic = new Traffic
        {
            Fingerprint = fingerprint,
            Time = DateTime.UtcNow
        };

        _context.SiteTraffic.Add(traffic);
        _context.SaveChanges();

        return Ok(traffic);
    }
}