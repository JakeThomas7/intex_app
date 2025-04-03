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
    
    public UsersController(UserIdentityDbContext temp, SignInManager<User> signInManager, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        _identityContext = temp;
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
        string role = null)
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
            query = query.Where(x => 
                x.User.FirstName.Contains(search) || 
                x.User.LastName.Contains(search) || 
                x.User.Email.Contains(search));
        }

        // Apply role filter if provided
        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(x => x.RoleName == role);
        }

        // Default sorting by name then email
        var orderedQuery = query
            .OrderBy(x => x.User.LastName)
            .ThenBy(x => x.User.FirstName)
            .ThenBy(x => x.User.Email);

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply pagination and final projection
        var results = await orderedQuery
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

        return Ok(new { Users = results, totalNumUsers = totalCount });
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
        // 1. Find the user
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return NotFound($"User with email '{email}' not found.");

        // 2. Remove all roles first (optional but recommended)
        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Any())
        {
            var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, roles);
            if (!removeRolesResult.Succeeded)
                return BadRequest($"Failed to remove roles: {string.Join(", ", removeRolesResult.Errors)}");
        }

        // 3. Delete the user
        var deleteResult = await _userManager.DeleteAsync(user);

        if (!deleteResult.Succeeded)
            return BadRequest($"Failed to delete user: {string.Join(", ", deleteResult.Errors)}");

        // 4. (Optional) Clean up related data
        try
        {
            // Example: Delete user's records from other tables
            await _identityContext.UserTokens.Where(ut => ut.UserId == user.Id).ExecuteDeleteAsync();
            await _identityContext.UserLogins.Where(ul => ul.UserId == user.Id).ExecuteDeleteAsync();
        }
        catch (Exception ex)
        {
            // Log but don't fail the operation
            //_logger.LogWarning(ex, "Failed to clean up related user data for {Email}", email);
        }

        return Ok($"User '{email}' and {roles.Count} roles were successfully deleted.");
    }
}