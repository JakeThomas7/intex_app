using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using intex_app.API.Data;
using intex_app.API.Services; // Add your email service

namespace intex_app.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TwoFactorController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager; // Inject SignInManager
        private readonly EmailService _emailService;

        public TwoFactorController(UserManager<User> userManager, SignInManager<User> signInManager, EmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager; // Initialize _signInManager
            _emailService = emailService;
        }

        // Endpoint to send the 2FA token via email
        [HttpPost("send")]
        public async Task<IActionResult> Send2FAToken([FromBody] Send2FATokenRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Ensure that 2FA is enabled
            if (!await _userManager.GetTwoFactorEnabledAsync(user))
            {
                return BadRequest(new { message = "2FA is not enabled for this user." });
            }

            // Generate the token and send via email
            var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");

            // Send the 2FA token to the user's email
            await _emailService.SendEmailAsync(user.Email, "Your 2FA Code", $"Your 2FA code is {token}");

            return Ok(new { message = "2FA token sent to your email" });
        }

        // Endpoint to verify the 2FA token entered by the user
        [HttpPost("verify")]
        public async Task<IActionResult> Verify2FAToken([FromBody] Verify2FATokenRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Verify the token entered by the user
            var isValid = await _userManager.VerifyTwoFactorTokenAsync(user, "Email", request.Token);

            if (isValid)
            {
                // Sign in the user after successful 2FA verification
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok(new { message = "2FA verification successful. You are now signed in." });
            }
            else
            {
                return BadRequest(new { message = "Invalid 2FA code." });
            }
        }
    }

    // Request models for sending and verifying the 2FA token
    public class Send2FATokenRequest
    {
        public string Email { get; set; }
    }

    public class Verify2FATokenRequest
    {
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
