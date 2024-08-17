using invoicer_backend_prot.Models;
using invoicer_backend_prot.Models.Invoice;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Previewer;

namespace invoicer_backend_prot.Generator;

public class PDFGenerator
{
    
    public static byte[] GeneratePdf(Invoice invoice)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var style = new TextStyle()
            .FontSize(13)
            .FontFamily(Fonts.SegoeUI);

        var pdfBytes = Document.Create(container =>
        {
            container
                .Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                // page.DefaultTextStyle(x => x.FontSize(20));
                // page.DefaultTextStyle(x => x.FontFamily(Fonts.SegoeUI));
                page.DefaultTextStyle(style);
                
                
                page.Header()
                    .Text(invoice.Title)
                    .Bold().FontSize(36)
                    .FontFamily(Fonts.SegoeUI);

                page.Content()
                    .DefaultTextStyle(style)
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(x =>
                    {
                        x.Spacing(20);
                        x.Item().Text($"Recipient: {invoice.Receiver}");
                        x.Item()
                            .Border(2)
                            .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(3);
                                columns.RelativeColumn(1);
                                columns.RelativeColumn(1);
                                columns.RelativeColumn(1);
                            });
                            
                            table.Cell().Element(CellTitleStyle).Text("Item Name");
                            table.Cell().Element(CellTitleStyle).Text("Quantity");
                            table.Cell().Element(CellTitleStyle).Text("Unit Cost");
                            table.Cell().Element(CellTitleStyle).Text("Final Cost");

                            for (int i = 0; i < invoice.Items.Count; i++)
                            {
                                table.Cell().Element(CellStyle).Text(invoice.Items[i].Name);
                                table.Cell().Element(CellStyle).Text($"{invoice.Items[i].Quantity}");
                                table.Cell().Element(CostCellStyle).Text($"{invoice.Currency} {invoice.Items[i].Cost}");
                                table.Cell().Element(CostCellStyle).Text($"{invoice.Currency} {CalculateFinalCost(invoice.Items[i].Cost, invoice.Items[i].Quantity)}");
                            }

                            table.Cell().ColumnSpan(3).Element(CellStyle).Text("Total");
                            table.Cell().Element(CostCellStyle).Text($"$ {CalculateTotal(invoice.Items)}");
                        });

                        x.Item().AlignBottom().AlignRight().Text(invoice.Sender);
                    });
                    
            });
        })
            // .GeneratePdf("Test.pdf")
            // .ShowInPreviewer()
            .GeneratePdf()
            ;

        return pdfBytes;
    }

    static IContainer CellStyle(IContainer container)
    {
        return container
            .BorderTop(0)
            .BorderBottom(1)
            .BorderLeft(1)
            .BorderRight(1)
            .BorderColor(Colors.Grey.Medium)
            .PaddingHorizontal(10)
            .PaddingVertical(5)
            .AlignMiddle();
    }
    static IContainer CostCellStyle(IContainer container)
    {
        return container
            .BorderTop(0)
            .BorderBottom(1)
            .BorderLeft(1)
            .BorderRight(1)
            .BorderColor(Colors.Grey.Medium)
            .PaddingHorizontal(10)
            .PaddingVertical(5)
            .AlignMiddle()
            .AlignRight();
    }

    static IContainer CellTitleStyle(IContainer container)
    {
        return container
            .Background(Colors.Grey.Lighten3)
            .Border(2)
            .BorderColor(Colors.Black)
            .PaddingHorizontal(10)
            .PaddingVertical(5)
            .AlignCenter()
            .DefaultTextStyle(x => x.Bold());
    }

    private static decimal CalculateTotal(List<Item> items)
    {
        return items.Select(i => CalculateFinalCost(i.Cost, i.Quantity)).Sum();
    }

    private static decimal CalculateFinalCost(decimal cost, int quantity)
    {
        return cost * quantity;
    }
}