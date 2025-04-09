using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using intex_app.API.Services;

namespace intex_app.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest emailRequest)
        {
            if (string.IsNullOrEmpty(emailRequest.Email) || string.IsNullOrEmpty(emailRequest.Subject) || string.IsNullOrEmpty(emailRequest.Body))
            {
                return BadRequest("Invalid email request");
            }

            await _emailService.SendEmailAsync(emailRequest.Email, emailRequest.Subject, emailRequest.Body);

            return Ok(new { message = "Email sent successfully" });
        }
    }
    
}