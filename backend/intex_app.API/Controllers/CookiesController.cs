using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace intex_app.API.Controllers
{
    [Route("[controller]")] // This sets the base route to /api/cookies
    [ApiController] // Properly applies API behavior
    public class CookiesController : ControllerBase
    {
        private readonly ILogger<CookiesController> _logger;

        public CookiesController(ILogger<CookiesController> logger)
        {
            _logger = logger;
        }
        
        [HttpGet("SendCookies")]
        public IActionResult SendCookies()
        {
            HttpContext.Response.Cookies.Append("FavoriteItems", "Item1", new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                HttpOnly = true,  // Prevent JavaScript access (enhanced security)
                Secure = true,    // Send only over HTTPS
                SameSite = SameSiteMode.Strict // Restrict cross-site requests
            });

            _logger.LogInformation("Cookie has been set.");

            return Ok(new { message = "Cookie set successfully" });
        }
    }
}