using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using intex_app.API.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

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
        
        public IdentityController(UserIdentityDbContext temp, SignInManager<User> signInManager, UserManager<User> userManager, TwoFactorAuthService twoFactorAuthService, IConfiguration config)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _twoFactorAuthService = twoFactorAuthService; // Initialize the service
            _config = config;
        }

        [HttpGet("getSecretKeys")]
        public IActionResult GetSecretKeys()
        {
            var dbConnection = _config.GetConnectionString("DbConnection");
            var identityConnection = _config.GetConnectionString("IdentityDbConnection");
            
            return Ok(new
            {
                DbConnection = dbConnection,
                IdentityDbConnection = identityConnection,
                SendGridApiKey = _config["SendGridApiKey"]
            });
        }

        [HttpGet("getTest")]
        public IActionResult GetTest()
        {
            return Ok(new { message = "Test Successful. 04/10 12:49" });
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
            // Get email from claims
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email claim missing" });
            }

            // Get user details
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { message = "User not found", email = email });
            }

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
                    lastName = user.LastName ?? "",
                    isAuthenticated = true,
                    allRoles = roles
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
                allRoles = rolesList
            });
        }
    }
}
