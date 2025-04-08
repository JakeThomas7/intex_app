using System.ComponentModel.DataAnnotations;

namespace intex_app.API.Data;

public class StreamingService
{
    [Key]
    public int StreamingServiceId { get; set; }

    public string Name { get; set; }

    // Navigation property
    public ICollection<MovieUserStreamingService> MovieUserStreamingServices { get; set; }
}