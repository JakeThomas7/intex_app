using System.Security.Claims;
using intex_app.API.Controllers;
using intex_app.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using intex_app.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DBConnection")));

builder.Services.AddDbContext<UserIdentityDbContext>(options =>  
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<UserIdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;
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
            policy.WithOrigins("https://cervelo.byjacobthomas.com", "http://localhost:3000")
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