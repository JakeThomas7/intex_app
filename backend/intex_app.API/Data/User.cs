using Microsoft.AspNetCore.Identity;

namespace intex_app.API.Data;

public class User : IdentityUser
{
    // Add custom properties here
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int AdminStatus { get; set; } = 0;
    
}
