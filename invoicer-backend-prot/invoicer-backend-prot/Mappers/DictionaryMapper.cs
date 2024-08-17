using System.Text.RegularExpressions;
using invoicer_backend_prot.Models.Invoice;

namespace invoicer_backend_prot.Mappers;

public static class DictionaryMapper
{
    public static Dictionary<string, List<string>>? ToDictionary(this string rawResponse)
    {
        var response = rawResponse.Replace("<|eot_id|>", "");
        
        var result = new Dictionary<string, List<string>>();
        
        string pattern = @"<(?<tag>\w+)>.*?<\/\k<tag>>";

        var matches = Regex.Matches(response, pattern);

        if (matches.Count == 0)
        {
            Console.WriteLine("Nothing is there");
            return null;
        }
        
        foreach (Match match in matches)
        {
            string tag = match.Groups["tag"].Value;
            string text = Regex.Replace(match.Value, "<.*?>", string.Empty).Trim();

            if (!result.ContainsKey(tag))
            {
                result[tag] = new List<string>();
            }
            
            result[tag].Add(text);
        }
        
        

        return result;
    }

    public static Invoice ToInvoice(this Dictionary<string, List<string>> dictionary)
    {
        var invoice = new Invoice();

        invoice.Title = dictionary["title"][0];
        invoice.Sender = dictionary["from"][0];
        invoice.Receiver = dictionary["to"][0];
        invoice.Currency = dictionary["currency"][0];

        for (int i = 0; i < dictionary["item"].Count; i++)
        {
            invoice.Items.Add(new Item
            {
                Id = i + 1,
                Name = dictionary["item"][i],
                Quantity = int.Parse(dictionary["quantity"][i]),
                Cost = decimal.Parse(dictionary["cost"][i])
            });
        }

        return invoice;
    }
}