using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserIdentityDbContext _identityContext;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ApplicationDbContext _context;
    
    public UsersController(UserIdentityDbContext temp, ApplicationDbContext context, SignInManager<User> signInManager, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        _identityContext = temp;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }
    
    // Update User Profile Endpoint
    [HttpPut("updateUserProfile")]
    public async Task<ObjectResult> UpdateUserProfile([FromBody] User request)
    {
        // Validate the request
        if (string.IsNullOrEmpty(request.Email))
        {
            return BadRequest(new { message = "Email is required." });
        }

        // Find the user by email
        var user = await _identityContext.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Update user details
        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;

        try
        {
            // Save changes to the database
            await _identityContext.SaveChangesAsync();
            return Ok(new { message = "Profile updated successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
        }
    }

    [HttpGet("users")]
    [Authorize(Roles = "Super Admin, Admin")]
    public async Task<IActionResult> GetUsers(
        int pageSize = 10, 
        int pageNum = 1,
        string search = null, 
        string role = null,
        string sortOrder = "asc")
    {
        // Base query with user and role data in a single join
        var query = 
            from user in _identityContext.Users
            join userRole in _identityContext.UserRoles 
                on user.Id equals userRole.UserId into userRoles
            from ur in userRoles.DefaultIfEmpty()
            join r in _identityContext.Roles 
                on ur.RoleId equals r.Id into roles
            from roleObj in roles.DefaultIfEmpty()
            select new 
            {
                User = user,
                RoleName = roleObj != null ? roleObj.Name : "User"
            };

        // Apply search filter if provided
        if (!string.IsNullOrEmpty(search))
        {
            
            // For SQL Server
            search = search.ToLower();
            query = query.Where(x => 
                (x.User.FirstName.ToLower() + " " + x.User.LastName.ToLower() + " " + x.User.Email.ToLower()).Contains(search)
            );
        }

        // Apply role filter if provided
        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(x => x.RoleName == role);
        }

        // Default sorting by name then email
        //var orderedQuery = query
        //    .OrderBy(x => x.User.FirstName)
        //    .ThenBy(x => x.User.Email)
        //    .ThenBy(x => x.User.LastName);

        // Get total count before pagination
        var totalNumUsers = await query.CountAsync();

        // Apply pagination and final projection
        var results = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new 
            {
                x.User.Id,
                x.User.FirstName,
                x.User.LastName,
                x.User.Email,
                Role = x.RoleName
            })
            .ToListAsync();

        return Ok(new { Users = results, totalNumUsers = totalNumUsers });
    }
    
    [HttpPost("assignRole")]
    [Authorize(Roles = "Super Admin")]
    public async Task<IActionResult> AssignRole(string email, string roleName)
    {
        // 1. Find the user
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return NotFound("User not found.");

        // 2. Check if the role exists
        if (!await _roleManager.RoleExistsAsync(roleName))
            return BadRequest("Role does not exist.");

        // 3. Remove ALL existing roles
        var currentRoles = await _userManager.GetRolesAsync(user);
        var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        
        if (!removeResult.Succeeded)
            return BadRequest("Failed to remove existing roles.");

        // 4. Add the new role
        var addResult = await _userManager.AddToRoleAsync(user, roleName);

        return addResult.Succeeded 
            ? Ok($"Assigned role '{roleName}' to user '{email}'. Removed old roles: {string.Join(", ", currentRoles)}") 
            : BadRequest(addResult.Errors);
    }

    [HttpDelete("deleteUser")]
    [Authorize(Roles = "Super Admin")]
    public async Task<IActionResult> DeleteUser(string email)
    {
        // 1. Find the Identity user
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return NotFound($"User with email '{email}' not found.");

        // 2. Remove all roles first
        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Any())
        {
            var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, roles);
            if (!removeRolesResult.Succeeded)
                return BadRequest($"Failed to remove roles: {string.Join(", ", removeRolesResult.Errors)}");
        }

        // 3. Find and delete MovieUser records
        var movieUser = _context.MovieUsers
            .Include(u => u.MovieUserStreamingServices)
            .Include(u => u.MovieRatings)
            .FirstOrDefault(u => u.Email == email);

        if (movieUser != null)
        {
            // Delete related records
            _context.MovieUserStreamingServices.RemoveRange(movieUser.MovieUserStreamingServices);
            _context.MovieRatings.RemoveRange(movieUser.MovieRatings);
            _context.MovieUsers.Remove(movieUser);
        }

        // 4. Delete the Identity user
        var deleteResult = await _userManager.DeleteAsync(user);
        if (!deleteResult.Succeeded)
            return BadRequest($"Failed to delete user: {string.Join(", ", deleteResult.Errors)}");

        // 5. Clean up other Identity related data
        try
        {
            await _identityContext.UserTokens.Where(ut => ut.UserId == user.Id).ExecuteDeleteAsync();
            await _identityContext.UserLogins.Where(ul => ul.UserId == user.Id).ExecuteDeleteAsync();
            await _identityContext.UserClaims.Where(uc => uc.UserId == user.Id).ExecuteDeleteAsync();
        }
        catch (Exception ex)
        {

        }

        // 6. Save all changes to the database
        try
        {
            await _context.SaveChangesAsync();
            await _identityContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Failed to save changes: {ex.Message}");
        }

        return Ok($"User '{email}' and all related data were successfully deleted. " + 
                 $"Removed {roles.Count} roles, {movieUser?.MovieUserStreamingServices.Count ?? 0} streaming services, " +
                 $"and {movieUser?.MovieRatings.Count ?? 0} ratings.");
    }
}