using Microsoft.AspNetCore.Identity.UI.Services;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace intex_app.API.Services;

public class SendGridEmailSender : IEmailSender
{
    private readonly string _sendGridApiKey;

    public SendGridEmailSender(string sendGridApiKey)
    {
        _sendGridApiKey = sendGridApiKey;
    }

    

    public async Task SendEmailAsync(string toEmail, string subject, string content)
    {
        var client = new SendGridClient(_sendGridApiKey);
        var from = new EmailAddress("mjmikes@byu.edu", "CineNiche");
        var to = new EmailAddress(toEmail);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, content, content);
        var response = await client.SendEmailAsync(msg);

        // Accept both 200 OK and 202 Accepted
        if (response.StatusCode != System.Net.HttpStatusCode.OK && 
            response.StatusCode != System.Net.HttpStatusCode.Accepted)
        {
            var responseBody = await response.Body.ReadAsStringAsync();
            throw new Exception($"Email failed to send. Status: {response.StatusCode}. Body: {responseBody}");
        }
    }

}