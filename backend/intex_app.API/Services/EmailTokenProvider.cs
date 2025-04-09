using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using intex_app.API.Services;

namespace intex_app.API.Services
{
    public class EmailTokenProvider<TUser> : TotpSecurityStampBasedTokenProvider<TUser> where TUser : class
    {
        private readonly EmailService _emailService;

        public EmailTokenProvider(EmailService emailService)
        {
            _emailService = emailService;
            TokenLifespan = TimeSpan.FromMinutes(5); // Set expiration for the token
        }

        public TimeSpan TokenLifespan { get; set; }

        public override Task<string> GenerateAsync(string purpose, UserManager<TUser> manager, TUser user)
        {
            // Ensure user is cast to IdentityUser if it has the Email property
            var identityUser = user as IdentityUser;

            if (identityUser == null)
            {
                throw new InvalidOperationException("User is not of type IdentityUser.");
            }

            // Generate a 6-digit random code for 2FA
            var token = new Random().Next(100000, 999999).ToString();

            // Send the token to the user's email
            var emailSubject = "Your 2FA Code";
            var emailBody = $"Your authentication code is: {token}";

            // Send the email using your EmailService
            _emailService.SendEmailAsync(identityUser.Email, emailSubject, emailBody);

            return Task.FromResult(token);
        }

        public override Task<bool> ValidateAsync(string purpose, string token, UserManager<TUser> manager, TUser user)
        {
            // You can validate the token here if needed, based on your application's logic
            return Task.FromResult(true);
        }

        public override Task<bool> CanGenerateTwoFactorTokenAsync(UserManager<TUser> manager, TUser user)
        {
            // Implement this if needed, or return true if you want to always generate tokens for users
            return Task.FromResult(true);
        }
    }
}
