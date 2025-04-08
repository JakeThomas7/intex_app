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
        
        [HttpPost("CreateMovieUser")]
        public IActionResult CreateMovieUser([FromBody] CreateMovieUserDto newUserDto)
        {
            try
            {

                // Check for existing user
                var existingUser = _context.MovieUsers
                    .FirstOrDefault(u => u.Email == newUserDto.Email);
                    
                if (existingUser != null)
                {
                    return Conflict("User with this email already exists");
                }

                // Create new user entity
                var newUser = new MovieUser
                {
                    Name = newUserDto.Name,
                    Email = newUserDto.Email,
                    Phone = newUserDto.Phone,
                    Age = newUserDto.Age,
                    Gender = newUserDto.Gender,
                    City = newUserDto.City,
                    State = newUserDto.State,
                    Zip = newUserDto.Zip,
                    MovieUserStreamingServices = new List<MovieUserStreamingService>()
                };

                // Add streaming service relationships
                if (newUserDto.StreamingServiceIds != null && newUserDto.StreamingServiceIds.Any())
                {
                    var validServices = _context.StreamingServices
                        .Where(s => newUserDto.StreamingServiceIds.Contains(s.StreamingServiceId))
                        .ToList();

                    foreach (var service in validServices)
                    {
                        newUser.MovieUserStreamingServices.Add(new MovieUserStreamingService
                        {
                            StreamingService = service
                        });
                    }
                }

                _context.MovieUsers.Add(newUser);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        
        [HttpPut("{id}")]
        [Authorize(Roles="Admin, Super Admin")]
        public IActionResult UpdateMovieUser(int id, [FromBody] MovieUser updatedUser)
        {
            var existingUser = _context.MovieUsers.Find(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Update fields
            existingUser.Name = updatedUser.Name;
            existingUser.Phone = updatedUser.Phone;
            existingUser.Email = updatedUser.Email;
            existingUser.Age = updatedUser.Age;
            existingUser.Gender = updatedUser.Gender;
            existingUser.City = updatedUser.City;
            existingUser.State = updatedUser.State;
            existingUser.Zip = updatedUser.Zip;

            _context.MovieUsers.Update(existingUser);
            _context.SaveChanges();

            return Ok(existingUser);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles="Admin, Super Admin")]
        public IActionResult DeleteMovieUser(int id)
        {
            var user = _context.MovieUsers.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.MovieUsers.Remove(user);
            _context.SaveChanges();

            return NoContent();
        }
    }
}