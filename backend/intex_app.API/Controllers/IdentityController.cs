using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers;

[Route("[controller]")]
[ApiController]
public class IdentityController : ControllerBase
{
    private readonly UserIdentityDbContext _identityContext;
    private readonly SignInManager<User> _signInManager;

    public IdentityController(UserIdentityDbContext temp, SignInManager<User> signInManager)
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
    public async Task<IActionResult> PingAuth()
    {
        // Check authentication
        if (!User.Identity?.IsAuthenticated ?? false)
        {
            return Unauthorized(new { message = "Not authenticated" });
        }

        // Get email from claims
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest(new { message = "Email claim missing" });
        }

        // Query user with null checks
        var dbUser = await _identityContext.Users
            .AsNoTracking() // Recommended for read-only operations
            .FirstOrDefaultAsync(u => u.Email == email);

        if (dbUser == null)
        {
            return NotFound(new { 
                message = "User not found",
                email = email 
            });
        }

        // Ensure safe null handling for all properties
        return Ok(new 
        {
            email = email,
            adminStatus = dbUser.AdminStatus, // int will default to 0
            firstName = dbUser.FirstName ?? "",
            lastName = dbUser.LastName ?? "",
            isAuthenticated = true
        });
    }
    
    // Update User Profile Endpoint
    [HttpPut("updateUserProfile")]
    [Authorize]
    public async Task<ObjectResult> UpdateUserProfile([FromBody] User request)
    {
        // Validate the request
        if (string.IsNullOrEmpty(request.Email))
        {
            return BadRequest(new { message = "Email is required." });
        }

        // Find the user by email
        var user = await _identityContext.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Update user details
        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;

        try
        {
            // Save changes to the database
            await _identityContext.SaveChangesAsync();
            return Ok(new { message = "Profile updated successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
        }
    }

    [HttpGet("users")]
    [Authorize]
    public IActionResult GetUsers(int pageSize = 10, int pageNum = 1, string sort = "asc", string search = "", int? adminStatus = null)
    {
        var query = _identityContext.Users.AsQueryable();

        // Search Filtering (Assuming search applies to name or email)
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.FirstName.Contains(search) || u.LastName.Contains(search) || u.Email.Contains(search));
        }

        // Filter by Admin Status
        if (adminStatus.HasValue)
        {
            query = query.Where(u => u.AdminStatus == adminStatus);
        }

        // Sorting (Example: Sorting by FirstName)
        if (sort == "asc")
        {
            query = query.OrderBy(u => u.FirstName);
        }
        else if (sort == "desc")
        {
            query = query.OrderByDescending(u => u.FirstName);
        }

        // Pagination
        var totalNumUsers = query.Count();
        var users = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { Users = users, totalNumUsers = totalNumUsers });
    }
}