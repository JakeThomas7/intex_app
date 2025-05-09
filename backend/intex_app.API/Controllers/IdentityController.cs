using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using intex_app.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore; // To use DbContext

namespace intex_app.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly TwoFactorAuthService _twoFactorAuthService; // Inject TwoFactorAuthService
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context; // Add ApplicationDbContext
        private readonly UserIdentityDbContext _identityContext;

        public IdentityController(UserIdentityDbContext temp, SignInManager<User> signInManager,
            UserManager<User> userManager, TwoFactorAuthService twoFactorAuthService,
            IConfiguration config, ApplicationDbContext context)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _twoFactorAuthService = twoFactorAuthService; // Initialize the service
            _config = config;
            _context = context; // Initialize ApplicationDbContext
            _identityContext = temp;
        }

        // [HttpGet("getSecretKeys")]
        // public IActionResult GetSecretKeys()
        // {
        //     var dbConnection = _config.GetConnectionString("DbConnection");
        //     var identityConnection = _config.GetConnectionString("IdentityDbConnection");
            
        //     return Ok(new
        //     {
        //         DbConnection = dbConnection,
        //         IdentityDbConnection = identityConnection,
        //         SendGridApiKey = _config["SendGridApiKey"]
        //     });
        // }

        [HttpGet("getTest")]
        public IActionResult GetTest()
        {
            return Ok(new { message = "Test Successful. 04/10 12:22" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            var email = User.FindFirstValue(ClaimTypes.Email);

            if (!string.IsNullOrEmpty(email))
            {
                // Find any verified OTP entries for this user
                var verifiedOtps = await _identityContext.UserOtp
                    .Where(u => u.Email == email && u.IsVerified)
                    .ToListAsync();

                // Set them back to unverified
                foreach (var otp in verifiedOtps)
                {
                    otp.IsVerified = false;
                }

                await _identityContext.SaveChangesAsync();
            }

            // Remove authentication cookie
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
        // Ensure the endpoint requires authentication
        public async Task<IActionResult> PingAuth()
        {
            // Get email from claims
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email claim missing" });
            }

            // Console.WriteLine($"Email from claims: {email}"); // Debugging the extracted email

            // Get user details from Identity
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { message = "User not found", email = email });
            }

            // Console.WriteLine($"Found Identity user: {user.Email}"); // Debugging the found user

            // Fetch userId from the MovieUsers table based on the logged-in user's email
            var movieUser = await _context.MovieUsers
                .FirstOrDefaultAsync(u => u.Email == email);

            if (movieUser == null)
            {
                return NotFound(new { message = "User not found in MovieUsers table" });
            }

            // Console.WriteLine($"Found MovieUser: UserId = {movieUser.UserId}"); // Debugging the MovieUser

            // Check if TwoFa is enabled for the user
            var twoFaEnabled = await _twoFactorAuthService.CheckTwoFaEnabledAsync(email);
            if (!twoFaEnabled)
            {
                // If TwoFa is not enabled, skip OTP verification and authenticate directly
                await _signInManager.SignInAsync(user, isPersistent: false);

                var roles = await _userManager.GetRolesAsync(user) ?? new List<string>();
                var primaryRole = roles.Count > 0 ? roles[0] : "User";

                return Ok(new
                {
                    email = email,
                    role = primaryRole,
                    firstName = user.FirstName ?? "",
                    lastName = user.LastName ?? "1",
                    isAuthenticated = true,
                    allRoles = roles,
                    userId = movieUser.UserId // Add userId from MovieUsers table
                });
            }

            // If TwoFa is enabled, verify OTP
            var otpVerified = await _twoFactorAuthService.IsOtpVerifiedAsync(email);
            if (!otpVerified)
            {
                return Unauthorized(new { message = "OTP verification is required" });
            }

            // OTP is verified, sign the user in
            await _signInManager.SignInAsync(user, isPersistent: false);

            var rolesList = await _userManager.GetRolesAsync(user) ?? new List<string>();
            var primaryRoleForUser = rolesList.Count > 0 ? rolesList[0] : "User";

            return Ok(new
            {
                email = email,
                role = primaryRoleForUser,
                firstName = user.FirstName ?? "",
                lastName = user.LastName ?? "",
                isAuthenticated = true,
                allRoles = rolesList,
                userId = movieUser.UserId // Add userId from MovieUsers table
            });
        }
    }
}
