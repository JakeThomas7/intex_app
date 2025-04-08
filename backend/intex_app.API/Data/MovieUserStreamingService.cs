namespace intex_app.API.Data;

public class MovieUserStreamingService
{
    public int UserId { get; set; }
    public MovieUser MovieUser { get; set; }

    public int StreamingServiceId { get; set; }
    public StreamingService StreamingService { get; set; }
}