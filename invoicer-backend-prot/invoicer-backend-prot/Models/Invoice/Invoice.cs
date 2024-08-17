using System.ComponentModel.DataAnnotations;

namespace invoicer_backend_prot.Models.Invoice;

public class Invoice
{
    [Required]
    [Length(0, 128, ErrorMessage = "Title should be between 0 and 128 characters")]
    public string Title { get; set; } = string.Empty;
    [Required]
    [Length(0, 128, ErrorMessage = "Sender should be between 0 and 128 characters")]
    public string Sender { get; set; } = string.Empty;
    [Required]
    [Length(0, 128, ErrorMessage = "Receiver should be between 0 and 128 characters")]
    public string Receiver { get; set; } = string.Empty;
    public string Currency { get; set; } = "$";
    public List<Item> Items { get; set; } = new List<Item>();
}