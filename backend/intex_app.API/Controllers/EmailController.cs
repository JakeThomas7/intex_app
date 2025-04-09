[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly EmailService _emailService;

    public AuthController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send-2fa")]
    public async Task<IActionResult> SendTwoFactorCode([FromBody] UserLoginModel model)
    {
        // Generate the 2FA code (example: a simple GUID)
        var code = Guid.NewGuid().ToString("N");

        // Send the 2FA code to the user's email
        await _emailService.SendEmailAsync(model.Email, "Your 2FA Code", $"Your 2FA code is: {code}");

        return Ok(new { Message = "2FA code sent" });
    }
}