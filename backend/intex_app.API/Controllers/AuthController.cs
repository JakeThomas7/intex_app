using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using intex_app.API.Services;

namespace intex_app.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TwoFactorAuthService _twoFactorAuthService;

        public AuthController(TwoFactorAuthService twoFactorAuthService)
        {
            _twoFactorAuthService = twoFactorAuthService;
        }

        // Endpoint to trigger OTP sending
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            if (string.IsNullOrEmpty(request.UserEmail))
            {
                return BadRequest("User email is required.");
            }

            await _twoFactorAuthService.SendOtpEmailAsync(request.UserEmail);
            return Ok("OTP sent to email.");
        }

        // Endpoint to verify OTP
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            bool isValid = await _twoFactorAuthService.VerifyOtpAsync(request.UserEmail, request.Otp);
            if (isValid)
            {
                return Ok("OTP verified successfully.");
            }
            else
            {
                return Unauthorized("Invalid or expired OTP.");
            }
        }
    }

    // Request models for OTP
    public class VerifyOtpRequest
    {
        public string UserEmail { get; set; }
        public string Otp { get; set; }
    }

    public class SendOtpRequest
    {
        public string UserEmail { get; set; }
    }
}