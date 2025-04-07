using System.ComponentModel.DataAnnotations;
using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Uri = System.Uri;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace intex_app.API.Controllers
{
    [ApiController]
    [Route("api/2fa")]
    public class TwoFactorAuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public TwoFactorAuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("generate")]
        [Authorize]
        public async System.Threading.Tasks.Task<IActionResult> Generate2faSetup()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            // Generate the authenticator key
            await _userManager.ResetAuthenticatorKeyAsync(user);
            var key = await _userManager.GetAuthenticatorKeyAsync(user);
            
            // Generate QR code URI
            var email = await _userManager.GetEmailAsync(user);
            var authenticatorUri = GenerateQrCodeUri("Your App Name", email, key);

            return Ok(new
            {
                SharedKey = key,
                AuthenticatorUri = authenticatorUri
            });
        }

        [HttpPost("verify")]
        [Authorize]
        public async System.Threading.Tasks.Task<IActionResult> Verify2fa([FromBody] Verify2faRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var isValid = await _userManager.VerifyTwoFactorTokenAsync(
                user,
                _userManager.Options.Tokens.AuthenticatorTokenProvider,
                request.Code);

            if (!isValid) return BadRequest(new { Error = "Invalid verification code" });

            await _userManager.SetTwoFactorEnabledAsync(user, true);
            
            // Generate recovery codes
            var recoveryCodes = await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, 10);
            
            return Ok(new
            {
                RecoveryCodes = recoveryCodes.ToArray(),
                Message = "2FA enabled successfully"
            });
        }

        private string GenerateQrCodeUri(string appName, string email, string secretKey)
        {
            return $"otpauth://totp/{Uri.EscapeDataString(appName)}:{Uri.EscapeDataString(email)}?secret={secretKey}&issuer={Uri.EscapeDataString(appName)}&digits=6";
        }

        public class Verify2faRequest
        {
            [Required]
            public string Code { get; set; }
        }
    }
};

public class TwoFactorAuthController
{
    
}