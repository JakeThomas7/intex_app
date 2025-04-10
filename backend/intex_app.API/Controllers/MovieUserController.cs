using intex_app.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace intex_app.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
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
        
        [HttpPost("UpsertMovieUser")] // Consider using `[HttpPut]` for RESTful upsert semantics
        public IActionResult UpsertMovieUser([FromBody] CreateMovieUserDto userDto)
        {
            try
            {
                // Check for existing user by email
                var existingUser = _context.MovieUsers
                    .Include(u => u.MovieUserStreamingServices)
                    .FirstOrDefault(u => u.Email == userDto.Email);

                if (existingUser != null)
                {
                    // Update existing user
                    existingUser.Name = userDto.Name;
                    existingUser.Phone = userDto.Phone;
                    existingUser.Age = userDto.Age;
                    existingUser.Gender = userDto.Gender;
                    existingUser.City = userDto.City;
                    existingUser.State = userDto.State;
                    existingUser.Zip = userDto.Zip;

                    // Handle streaming services if provided
                    if (userDto.StreamingServiceIds != null)
                    {
                        // Clear existing relationships
                        existingUser.MovieUserStreamingServices.Clear();

                        // Add new relationships
                        var validServices = _context.StreamingServices
                            .Where(s => userDto.StreamingServiceIds.Contains(s.StreamingServiceId))
                            .ToList();

                        foreach (var service in validServices)
                        {
                            existingUser.MovieUserStreamingServices.Add(new MovieUserStreamingService
                            {
                                StreamingServiceId = service.StreamingServiceId
                            });
                        }
                    }

                    _context.SaveChanges();
                    return Ok(existingUser);
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
                        Zip = userDto.Zip,
                        MovieUserStreamingServices = new List<MovieUserStreamingService>()
                    };

                    if (userDto.StreamingServiceIds != null && userDto.StreamingServiceIds.Any())
                    {
                        var validServices = _context.StreamingServices
                            .Where(s => userDto.StreamingServiceIds.Contains(s.StreamingServiceId))
                            .ToList();

                        foreach (var service in validServices)
                        {
                            newUser.MovieUserStreamingServices.Add(new MovieUserStreamingService
                            {
                                StreamingServiceId = service.StreamingServiceId
                            });
                        }
                    }

                    _context.MovieUsers.Add(newUser);
                    _context.SaveChanges();
                    return Ok(newUser);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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