using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace intex_app.API.Controllers;

[Route("[controller]")]
[ApiController]
public class HeadlineController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public HeadlineController(ApplicationDbContext temp)
    {
        _context = temp;
    }

    [HttpGet("GetHeadlines")]
    public IActionResult GetHeadlines()
    {
        var headlines = _context.Headlines.ToList();
        return Ok(headlines);
    }

    [Authorize(Roles="Admin, Super Admin")]
    [HttpPost("UpdateHeadline/{id}")]
    public IActionResult UpdateHeadline(int id, [FromBody] Headline updatedHeadline)
    {
        var headline = _context.Headlines.Find(id);
        if (headline == null)
        {
            return NotFound();
        }
        
        headline.Title = updatedHeadline.Title;
        headline.Text = updatedHeadline.Text;
        
        _context.Headlines.Update(headline);
        _context.SaveChanges();

        return Ok(headline);
    }

    [HttpPost("CreateHeadline")]
    [Authorize(Roles="Admin, Super Admin")]
    public IActionResult CreateHeadline([FromBody] Headline headline)
    {
        _context.Headlines.Add(headline);
        _context.SaveChanges();
        return Ok(headline);
    }

    [HttpDelete("DeleteHeadline/{id}")]
    [Authorize(Roles="Admin, Super Admin")]
    public IActionResult DeleteHeadline(int id)
    {
        var headline = _context.Headlines.Find(id);
        _context.Headlines.Remove(headline);
        
        _context.SaveChanges();
        
        return NoContent();
    }

}