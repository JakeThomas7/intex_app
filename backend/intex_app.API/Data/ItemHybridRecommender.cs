using System.ComponentModel.DataAnnotations;

namespace intex_app.API.Data;

public class ItemHybridRecommender
{
    [Key]
    public int show_id { get; set; }
    public int rec_id_1 { get; set; }
    public int rec_id_2 { get; set; }
    public int rec_id_3 { get; set; }
    public int rec_id_4 { get; set; }
    public int rec_id_5 { get; set; }
    public int rec_id_6 { get; set; }
    public int rec_id_7 { get; set; }
    public int rec_id_8 { get; set; }
    public int rec_id_9 { get; set; }
    public int rec_id_10 { get; set; }
}