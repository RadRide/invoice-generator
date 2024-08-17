namespace invoicer_backend_prot.Models.Invoice;

public class Item
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public decimal Cost { get; set; } = 0;
}