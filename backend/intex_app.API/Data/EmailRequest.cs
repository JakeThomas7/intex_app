namespace intex_app.API.Controllers
{
    public class EmailRequest
    {
        public string Email { get; set; } // Recipient's email address
        public string Subject { get; set; } // Email subject
        public string Body { get; set; } // Email body content
    }
}