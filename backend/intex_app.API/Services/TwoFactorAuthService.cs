using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using intex_app.API.Data;

namespace intex_app.API.Services
{
    public class TwoFactorAuthService
    {
        private readonly UserIdentityDbContext _context;

        public TwoFactorAuthService(UserIdentityDbContext context)
        {
            _context = context;
        }

        // Generate OTP (6-digit random number)
        public string GenerateOtp()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        // Send OTP (store in UserOtp table)
        public async Task SendOtpEmailAsync(string userEmail)
        {
            string otp = GenerateOtp();
            var expirationTime = DateTime.UtcNow.AddMinutes(5);  // OTP expires in 5 minutes

            var userOtp = new UserOtp
            {
                Email = userEmail,
                OtpCode = otp,
                ExpirationTime = expirationTime,
                IsVerified = false
            };

            _context.UserOtp.Add(userOtp);
            await _context.SaveChangesAsync();

            // You can implement email sending logic here (e.g., using IEmailSender)
            // Example: await _emailSender.SendEmailAsync(userEmail, "Your OTP", $"Your OTP is {otp}");
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

        public bool VerifyOtp(string requestUserEmail, string requestOtp)
        {
            throw new NotImplementedException();
        }
    }
}
