using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using intex_app.API.Data;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace intex_app.API.Services
{
    public class TwoFactorAuthService
    {
        private readonly UserIdentityDbContext _context;
        private readonly IEmailSender _emailSender;  // Add IEmailSender

        // Modify constructor to accept IEmailSender
        public TwoFactorAuthService(UserIdentityDbContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;  // Inject IEmailSender
        }

        // Generate OTP (6-digit random number)
        public string GenerateOtp()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        // Send OTP (store in UserOtp table and send the email)
        public async Task SendOtpEmailAsync(string userEmail)
        {
            string otp = GenerateOtp();
            var expirationTime = DateTime.UtcNow.AddMinutes(5);  // OTP expires in 5 minutes

            // Check if there's an existing OTP for this email that hasn't been verified or expired
            var existingOtp = await _context.UserOtp
                .Where(u => u.Email == userEmail && !u.IsVerified && DateTime.UtcNow <= u.ExpirationTime)
                .FirstOrDefaultAsync();

            if (existingOtp != null)
            {
                // If an OTP exists and it's still valid, update it
                existingOtp.OtpCode = otp;
                existingOtp.ExpirationTime = expirationTime;  // Update expiration time
                _context.UserOtp.Update(existingOtp);  // Update existing record
            }
            else
            {
                // If no valid OTP exists, create a new record
                var userOtp = new UserOtp
                {
                    Email = userEmail,
                    OtpCode = otp,
                    ExpirationTime = expirationTime,
                    IsVerified = false
                };
                _context.UserOtp.Add(userOtp);  // Add new OTP
            }

            await _context.SaveChangesAsync();  // Save changes

            // Send OTP email using IEmailSender (SendGridEmailSender)
            string subject = "Your OTP Code";
            string content = $"Your OTP is {otp}. It will expire in 5 minutes.";

            await _emailSender.SendEmailAsync(userEmail, subject, content);  // Send email
        }


        // Verify OTP
        public async Task<bool> VerifyOtpAsync(string userEmail, string enteredOtp)
        {
            var userOtp = await _context.UserOtp
                .Where(u => u.Email == userEmail && u.OtpCode == enteredOtp && !u.IsVerified)
                .FirstOrDefaultAsync();

            if (userOtp == null)
            {
                return false;  // OTP not found or already verified
            }

            // Check if OTP has expired
            if (DateTime.UtcNow > userOtp.ExpirationTime)
            {
                _context.UserOtp.Remove(userOtp);  // Remove expired OTP
                await _context.SaveChangesAsync();
                return false;
            }

            // Mark OTP as verified
            userOtp.IsVerified = true;
            await _context.SaveChangesAsync();

            return true;  // OTP is valid
        }
    }
}
