using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace intex_app.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UsersController> _logger;

        // Inject ILogger into the controller
        public UsersController(ApplicationDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }
        
        [HttpGet("Users")]
        public IActionResult GetUsers()
        {
            return Ok(_context.Users);
        }

        [HttpPost("Authenticate")]
        public IActionResult Authenticate([FromBody] AuthRequest request)
        {

            var user = _context.Users.SingleOrDefault(u => u.Username == request.Username);
            
            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            bool isPasswordValid = request.Password == user.Password;

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid username or password.");
            }
            
            return Ok(user);
        }

        [HttpGet("CheckUsername/{username}")]
        public IActionResult CheckAvailability(string username)
        {
            bool exists = _context.Users.Any(u => u.Username == username);
            return exists ? Conflict("Username is taken") : Ok();
        }
        
        [HttpPost("Create")]
        public IActionResult AddBook([FromBody] User newUser)
        {
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return Ok(newUser);
        }
    }
}