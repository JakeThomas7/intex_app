using System.ComponentModel.DataAnnotations;

namespace intex_app.API.Data;

public class Traffic
{
    [Key]
    public int TrafficId { get; set; }
    
    public string Fingerprint { get; set; }
    
    public DateTime Time { get; set; }
}