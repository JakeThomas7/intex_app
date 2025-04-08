using intex_app.API.Data;
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
        
        
        [HttpPut("{id}")]
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