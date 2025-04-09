using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.UI.Services;

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
        var from = new EmailAddress("mjmikes@byu.edu", "CineNiche");  // Ensure this is a verified sender
        var to = new EmailAddress(toEmail);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, content, content);
        var response = await client.SendEmailAsync(msg);

        // Log the status code and response body to get more details
        var responseBody = await response.Body.ReadAsStringAsync();
        if (response.StatusCode != System.Net.HttpStatusCode.OK)
        {
            throw new Exception($"Failed to send email. StatusCode: {response.StatusCode}, Body: {responseBody}");
        }
    }

}