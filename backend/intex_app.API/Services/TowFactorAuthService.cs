public string GenerateOtp()
{
    Random random = new Random();
    string otp = random.Next(100000, 999999).ToString();
    return otp;
}

public async Task SendOtpEmailAsync(string userEmail)
{
    string otp = GenerateOtp();
    string subject = "Your OTP Code";
    string content = $"Your One-Time Password (OTP) is: {otp}";

    await _emailSender.SendEmailAsync(userEmail, subject, content);

    // Optionally, store OTP in database and associate it with the user
    // For security, consider storing it for a short time (e.g., 10 minutes)
}