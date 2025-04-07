using System.Security.Claims;
using intex_app.API.Controllers;
using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using intex_app.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

builder.Services.AddDbContext<UserIdentityDbContext>(options =>  
    options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<User>()
    .AddRoles<IdentityRole>() // For role based authentication
    .AddEntityFrameworkStores<UserIdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    // Existing configurations
    options.ClaimsIdentity.RoleClaimType = ClaimTypes.Role; // For role based authentication
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;

    // Password settings
    options.Password.RequireDigit = false;                   // Requires a number
    options.Password.RequiredLength = 5;                    // Set the minimum length of the password
    options.Password.RequireNonAlphanumeric = false;         // Requires a non-alphanumeric character
    options.Password.RequireUppercase = false;               // Requires an uppercase letter
    options.Password.RequireLowercase = false;               // Requires a lowercase letter
    options.Password.RequiredUniqueChars = 0;               // Requires a number of unique characters
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    //options.Cookie.Domain = ".byjacobthomas.com";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.LoginPath = "/login";
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://cervelo.byjacobthomas.com", "https://cervelo2.byjacobthomas.com", "http://localhost:3000")
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<User>();

app.Run();