using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using intex_app.API.Services;  // Ensure this namespace is added

namespace intex_app.API.Controllers;

[Route("[controller]")]
[ApiController]
public class IdentityController : ControllerBase
{
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;
    private readonly TwoFactorAuthService _twoFactorAuthService; // Inject TwoFactorAuthService

    public IdentityController(UserIdentityDbContext temp, SignInManager<User> signInManager, UserManager<User> userManager, TwoFactorAuthService twoFactorAuthService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _twoFactorAuthService = twoFactorAuthService; // Initialize the service
    }

    [HttpGet("getTest")]
    public IActionResult GetTest()
    {
        return Ok(new { message = "Test Successful. 04 10:08" });
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
            SameSite = SameSiteMode.None,
            Domain = ".byjacobthomas.com"
        });

        return Ok(new { message = "Logout successful" });
    }

    [HttpGet("pingauth")]
    [Authorize] // Ensure the endpoint requires authentication
    public async Task<IActionResult> PingAuth()
    {
        // 1. Safely get email from claims
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest(new { message = "Email claim missing" });
        }

        // 2. Safely get user
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found",
                email = email
            });
        }

        // 3. Check if OTP is verified
        var otpVerified = await _twoFactorAuthService.IsOtpVerifiedAsync(email); // Custom method in TwoFactorAuthService

        if (!otpVerified)
        {
            // User needs to verify OTP
            return Unauthorized(new { message = "OTP verification is required" });
        }

        // 4. Safely get roles (with null check)
        var roles = await _userManager.GetRolesAsync(user) ?? new List<string>();

        // 5. Safely get first role or default to "User"
        var primaryRole = roles.Count > 0 ? roles[0] : "User";

        return Ok(new
        {
            email = email,
            role = primaryRole, // Safe access to first role
            firstName = user.FirstName ?? "",
            lastName = user.LastName ?? "",
            isAuthenticated = true,
            allRoles = roles // Optional: return all roles for debugging
        });
    }
}
