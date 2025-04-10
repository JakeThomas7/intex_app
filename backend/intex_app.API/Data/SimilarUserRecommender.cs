using System.ComponentModel.DataAnnotations;

namespace intex_app.API.Data;

public class SimilarUserRecommender
{
    [Key]
    public byte UserId { get; set; }
    public string RecId1 { get; set; }
    public string RecId2 { get; set; }
    public string RecId3 { get; set; }
    public string RecId4 { get; set; }
    public string RecId5 { get; set; }
    public string RecId6 { get; set; }
    public string RecId7 { get; set; }
    public string RecId8 { get; set; }
    public string RecId9 { get; set; }
    public string RecId10 { get; set; }
}
