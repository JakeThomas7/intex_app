namespace intex_app.API.Data
{
    public class UserOtp
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string OtpCode { get; set; }
        public DateTime ExpirationTime { get; set; }
        public bool IsVerified { get; set; }
    }
}