using System.Net.Mime;
using invoicer_backend_prot.Comms;
using invoicer_backend_prot.Generator;
using invoicer_backend_prot.Mappers;
using invoicer_backend_prot.Models;
using invoicer_backend_prot.Models.Invoice;
using Microsoft.AspNetCore.Mvc;

namespace invoicer_backend_prot.Controller;

[Route("api/invoice")]
[ApiController]
public class InvoiceController : ControllerBase
{
    
    [HttpPost]
    public async Task<IActionResult> GetInvoice([FromBody] Invoice invoice)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var pdfFileBytes = PDFGenerator.GeneratePdf(invoice);

        // This is so IDM does not automatically download the file
        var contentDisposition = new ContentDisposition
        {
            FileName = "Invoice.pdf",
            Inline = false
        };

        return File(pdfFileBytes, "application/pdf", "Invoice.pdf");

        // return Ok(response.TagDictionary);
    }

    [HttpPost("check")]
    public async Task<IActionResult> GetResult([FromBody] string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            return BadRequest("No message to analyze");
        }

        var request = new Request();
        request.Message = message;

        var response = await AiApi.SendToAiAsync(request);
        
        if (response is null)
        {
            return BadRequest("An error occured while processing your message");
        }

        if (response.IsEmpty() || response.TagDictionary is null)
        {
            return NotFound("The message you sent did not correspond to an invoice");
        }
        
        return Ok(response.TagDictionary.ToInvoice());
    }
}