using invoicer_backend_prot.Mappers;

namespace invoicer_backend_prot.Models;

public class Response
{
    public string RawResponse { get; set; }
    public Dictionary<string, List<string>>? TagDictionary { get; set; }

    public Response(string rawResponse)
    {
        RawResponse = rawResponse;
        TagDictionary = RawResponse.ToDictionary();
    }

    public bool IsEmpty()
    {
        return TagDictionary is null;
    }
}