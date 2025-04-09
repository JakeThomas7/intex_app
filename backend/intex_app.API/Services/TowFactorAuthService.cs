using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.UI.Services;

public class TwoFactorAuthService
{
    private readonly IEmailSender _emailSender;

    // Using ConcurrentDictionary to handle concurrent access to OTPs (thread safety)
    private static readonly ConcurrentDictionary<string, (string otp, DateTime expiration)> _otpStore = new ConcurrentDictionary<string, (string, DateTime)>();

    public TwoFactorAuthService(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    // Generate OTP
    public string GenerateOtp()
    {
        Random random = new Random();
        string otp = random.Next(100000, 999999).ToString();
        return otp;
    }

    // Send OTP email to the user and store it with an expiration time (10 minutes)
    public async Task SendOtpEmailAsync(string userEmail)
    {
        string otp = GenerateOtp();
        string subject = "Your OTP Code";
        string content = $"Your One-Time Password (OTP) is: {otp}";

        await _emailSender.SendEmailAsync(userEmail, subject, content);

        // Store OTP with expiration time (10 minutes)
        DateTime expirationTime = DateTime.Now.AddMinutes(10);
        _otpStore[userEmail] = (otp, expirationTime);

        // Optionally, log for debugging purposes
        Console.WriteLine($"OTP for {userEmail}: {otp}, Expiration: {expirationTime}");
    }

    // Verify OTP
    public bool VerifyOtp(string userEmail, string enteredOtp)
    {
        if (_otpStore.ContainsKey(userEmail))
        {
            var otpRecord = _otpStore[userEmail];

            // Log OTP verification details
            Console.WriteLine($"Verifying OTP for {userEmail}. Stored OTP: {otpRecord.otp}, Expiration: {otpRecord.expiration}");

            // Check if OTP is expired
            if (DateTime.Now > otpRecord.expiration)
            {
                // OTP has expired
                _otpStore.TryRemove(userEmail, out _); // Remove expired OTP
                Console.WriteLine($"OTP expired for {userEmail}");
                return false;
            }

            // Check if entered OTP matches the stored OTP
            if (enteredOtp == otpRecord.otp)
            {
                // OTP is valid
                _otpStore.TryRemove(userEmail, out _); // Optionally remove OTP after successful verification
                Console.WriteLine($"OTP verified successfully for {userEmail}");
                return true;
            }
        }

        // OTP is invalid or not found
        Console.WriteLine($"OTP not found or invalid for {userEmail}");
        return false;
    }
}
