using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

namespace intex_app.API.Controllers;

[Route("[controller]")]
[ApiController]
public class IdentityController : ControllerBase
{
    private readonly UserIdentityDbContext _identityContext;
    private readonly SignInManager<IdentityUser> _signInManager;

    public IdentityController(UserIdentityDbContext temp, SignInManager<IdentityUser> signInManager)
    {
        _identityContext = temp;
        _signInManager = signInManager;
    }

    [HttpGet("getTest")]
    public IActionResult GetTest()
    {
        return Ok(new { message = "Test Successful" });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();

        // Ensure authentication cookie is removed
        Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None
        });

        return Ok(new { message = "Logout successful" });
    }

    [HttpGet("pingauth")]
    public IActionResult PingAuth()
    {
        var user = HttpContext.User;

        if (!user.Identity?.IsAuthenticated ?? false)
        {
            return Unauthorized();
        }

        var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com"; // Ensure it's never null
        return Ok(new { email = email });
    }
}