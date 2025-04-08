using System.ComponentModel.DataAnnotations;

namespace intex_app.API.Data
{
    public class MovieUser
    {
        [Key]
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        
        public string? City { get; set; }
        public string? State { get; set; }
        public int? Zip { get; set; }
        
        public ICollection<MovieUserStreamingService> MovieUserStreamingServices { get; set; }
    }
    
    public class CreateMovieUserDto
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public int? Zip { get; set; }
    
        // Only include streaming service IDs
        public List<int>? StreamingServiceIds { get; set; }
    }

}