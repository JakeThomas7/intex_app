using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace intex_app.API.Services
{
    public class EmailService
    {
        private readonly string _sendGridApiKey;

        public EmailService(IConfiguration configuration)
        {
            // Retrieve the SendGrid API key from appsettings.json or environment variables
            _sendGridApiKey = configuration["SendGrid:ApiKey"];
        }

        public async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            try
            {
                // Create a new SendGrid client with the API key
                var client = new SendGridClient(_sendGridApiKey);

                // Create email addresses for "from" and "to" using SendGrid helpers
                var from = new EmailAddress("mjmikes@byu.edu", "CineNiche");
                var to = new EmailAddress(recipientEmail);

                // Define the plain text and HTML content of the email
                var plainTextContent = body;
                var htmlContent = $"<p>{body}</p>"; // Wrap body in HTML for HTML emails

                // Create the email message
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

                // Send the email asynchronously
                var response = await client.SendEmailAsync(msg);

                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    Console.WriteLine("Email sent successfully!");
                }
                else
                {
                    Console.WriteLine($"Failed to send email. Status: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                // Log any errors
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }
    }
}