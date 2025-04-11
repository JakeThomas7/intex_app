using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MovieUserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MovieUserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMovieUsers()
        {
            var users = _context.MovieUsers.ToList();
            return Ok(users);
        }

        [HttpGet("GetMovieUserByEmail/{email}")]
        [Authorize]
        public IActionResult GetMovieUserByEmail(string email)
        {
            // Query the user and include related streaming services
            var user = _context.MovieUsers
                .Include(u => u.MovieUserStreamingServices)
                .ThenInclude(mus => mus.StreamingService)
                .FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                return NotFound();
            }

            // Create a response object with user details and streaming service names
            var response = new
            {
                UserId = user.UserId,
                Name = user.Name,
                Phone = user.Phone,
                Email = user.Email,
                Age = user.Age,
                Gender = user.Gender,
                City = user.City,
                State = user.State,
                Zip = user.Zip,
                StreamingServiceNames = user.MovieUserStreamingServices
                    .Select(mus => mus.StreamingService.Name) // Extract streaming service names
                    .ToList()
            };

            return Ok(response);
        }
        
        [HttpPost("UpsertMovieUser")]
        public async Task<IActionResult> UpsertMovieUser([FromBody] CreateMovieUserDto userDto)
        {
            try
            {
                // Check for existing user by email (no tracking to prevent circular references)
                var existingUser = await _context.MovieUsers
                    .AsNoTracking()
                    .Include(u => u.MovieUserStreamingServices)
                    .FirstOrDefaultAsync(u => u.Email == userDto.Email);

                if (existingUser != null)
                {
                    // Update existing user via fresh entity
                    var updatedUser = new MovieUser
                    {
                        UserId = existingUser.UserId,
                        Name = userDto.Name,
                        Email = userDto.Email,
                        Phone = userDto.Phone,
                        Age = userDto.Age,
                        Gender = userDto.Gender,
                        City = userDto.City,
                        State = userDto.State,
                        Zip = userDto.Zip
                    };

                    // Handle streaming services
                    await UpdateUserStreamingServices(updatedUser.UserId, userDto.StreamingServiceIds);
                    
                    _context.MovieUsers.Update(updatedUser);
                }
                else
                {
                    // Create new user
                    var newUser = new MovieUser
                    {
                        Name = userDto.Name,
                        Email = userDto.Email,
                        Phone = userDto.Phone,
                        Age = userDto.Age,
                        Gender = userDto.Gender,
                        City = userDto.City,
                        State = userDto.State,
                        Zip = userDto.Zip
                    };

                    _context.MovieUsers.Add(newUser);
                    await _context.SaveChangesAsync(); // Save first to get ID
                    
                    // Handle streaming services after we have an ID
                    await UpdateUserStreamingServices(newUser.UserId, userDto.StreamingServiceIds);
                }

                await _context.SaveChangesAsync();
                return Ok(new { Success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    Success = false, 
                    Message = "Internal server error",
                    Error = ex.Message 
                });
            }
        }

        private async Task UpdateUserStreamingServices(int movieUserId, List<int>? streamingServiceIds)
        {
            if (streamingServiceIds == null || !streamingServiceIds.Any())
            {
                // Clear all relationships if no services provided
                await _context.MovieUserStreamingServices
                    .Where(x => x.UserId == movieUserId)
                    .ExecuteDeleteAsync();
                return;
            }

            // Get valid service IDs
            var validServiceIds = await _context.StreamingServices
                .Where(s => streamingServiceIds.Contains(s.StreamingServiceId))
                .Select(s => s.StreamingServiceId)
                .ToListAsync();

            // Clear existing relationships
            await _context.MovieUserStreamingServices
                .Where(x => x.UserId == movieUserId)
                .ExecuteDeleteAsync();

            // Add new relationships (IDs only, no navigation properties)
            var newRelationships = validServiceIds.Select(id => new MovieUserStreamingService
            {
                UserId = movieUserId,
                StreamingServiceId = id
            }).ToList();

            await _context.MovieUserStreamingServices.AddRangeAsync(newRelationships);
        }
        
        
        // [HttpPut("{id}")]
        // [Authorize(Roles="Admin, Super Admin")]
        // public IActionResult UpdateMovieUser(int id, [FromBody] MovieUser updatedUser)
        // {
        //     var existingUser = _context.MovieUsers.Find(id);
        //     if (existingUser == null)
        //     {
        //         return NotFound();
        //     }
        //
        //     // Update fields
        //     existingUser.Name = updatedUser.Name;
        //     existingUser.Phone = updatedUser.Phone;
        //     existingUser.Email = updatedUser.Email;
        //     existingUser.Age = updatedUser.Age;
        //     existingUser.Gender = updatedUser.Gender;
        //     existingUser.City = updatedUser.City;
        //     existingUser.State = updatedUser.State;
        //     existingUser.Zip = updatedUser.Zip;
        //
        //     _context.MovieUsers.Update(existingUser);
        //     _context.SaveChanges();
        //
        //     return Ok(existingUser);
        // }
        //
        // [HttpDelete("{id}")]
        // [Authorize(Roles="Admin, Super Admin")]
        // public IActionResult DeleteMovieUser(int id)
        // {
        //     var user = _context.MovieUsers.Find(id);
        //     if (user == null)
        //     {
        //         return NotFound();
        //     }
        //
        //     _context.MovieUsers.Remove(user);
        //     _context.SaveChanges();
        //
        //     return NoContent();
        // }
    }
}