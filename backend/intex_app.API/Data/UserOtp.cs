public class UserOtp
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string OtpCode { get; set; }
    public DateTime ExpirationTime { get; set; }
    public bool IsVerified { get; set; }
    public bool TwoFaEnabled { get; set; } = true; // Default value is true
}