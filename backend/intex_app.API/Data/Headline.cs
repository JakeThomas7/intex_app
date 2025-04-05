using System.ComponentModel.DataAnnotations;

namespace intex_app.API.Data;

public class Headline
{

    [Key]
    public int HeadlineId { get; set; }
    
    public string Title { get; set; }
    
    public string Text { get; set; }
    
}