using System.Security.Claims;
using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace intex_app.API.Services;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<User>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<User> userManager, 
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor) { }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(User user)
    {
        var identity = await base.GenerateClaimsAsync(user);
        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? "")); // Ensure email claim is always present
        return identity;
    }
}