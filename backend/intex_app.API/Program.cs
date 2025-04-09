using System.Security.Claims;
using intex_app.API.Controllers;
using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using intex_app.API.Services;
using Azure.Communication.Email;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add controllers, Swagger, etc.
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
    options.ClaimsIdentity.RoleClaimType = ClaimTypes.Role; // For role based authentication
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;

    // Password settings
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequiredUniqueChars = 0;
    
    // Enable email-based 2FA
    options.SignIn.RequireConfirmedEmail = true; // Ensure email is confirmed before login

    // 2FA settings for login
    options.Tokens.ProviderMap.Add("Email", new TokenProviderDescriptor(typeof(Microsoft.AspNetCore.Identity.EmailTokenProvider<User>)));
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Domain = ".byjacobthomas.com";
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

// Registering the Azure Communication Services Email Client
builder.Services.AddSingleton<EmailClient>(serviceProvider =>
{
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();
    string connectionString = configuration.GetValue<string>("AzureCommunicationServices:ConnectionString");
    return new EmailClient(connectionString);
});

// Registering the EmailService that uses ACS Email Client
builder.Services.AddScoped<EmailService>();

var app = builder.Build();

// Add the CSP header middleware
app.Use((context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy", "img-src 'self' data: https://*.blob.core.windows.net;");
    return next();
});

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
