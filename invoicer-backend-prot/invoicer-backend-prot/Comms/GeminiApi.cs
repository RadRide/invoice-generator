﻿using GenerativeAI.Models;
using GenerativeAI.Tools;
using invoicer_backend_prot.Models;

namespace invoicer_backend_prot.Comms;

public class GeminiApi
{
    private static readonly string _geminiToken = "AIzaSyDg7TFya3CMbsKuFQugMJrwnfrcakbEn5U";
    private static readonly string _instructions = "Your job is to generate a markup text for an invoice or a receipt depending on the user input. " +
                                          "You have 7 markup tags options: title, to, from, currency, item, quantity, cost. " +
                                          "An this what each means: " +
                                          "title: the title of the receipt which we generally only need one, each word inside it should be capitalized. " +
                                          "to: the name of the receiver of the invoice, each word inside it should be capitalized. " +
                                          "from: the name of the invoice sender, each word inside it should be capitalized. " +
                                          "currency: the type of currency that will be used in the invoice, it should be a symbol for example $ LBP or EUR ...etc, also if the user did not specify one, you should by default use $" +
                                          "item: the items to be added to the receipt which we might might need one or multiple depending on the user needs, each word inside it should be capitalized. " +
                                          "quantity: the quantity of the the ordered item which is strictly an integer and should never contain text only numbers, also if the user did not specify a quantity for an item, it should be 1. " +
                                          "cost: the cost of a single unit of that item which should strictly be a double and should never contain text only numbers, if the user did not specify a cost then it should be 0. " +
                                          "What we need you to do is take what the user has given you and generate a set of corresponding tag elements that will be used to formulate a receipt. " +
                                          "You only have to generate the different tags containing their corresponding attributes. You should not give any other text at the start" +
                                          "Additional notes: " +
                                          "Each item should be followed by his quantity and his cost. " +
                                          "The number of item, quantity and cost tags should be equal for example if you generated 3 item elements, then you should also generate 3 respective cost tags and 3 quantity tags. " +
                                          "If the user input is in arabic you should translate it to english and if needed make it formal" +
                                          "Here is an example of what a user might give and what you should respond with: " +
                                          "user: Give me an invoice from Glanis AI to mister assaf mrad with a title of ai automation invoice, " +
                                          "the invoice items are a youtube videos summary generator that cost 2500$, 3 auditing systems that cost each 500 dollars. " +
                                          "Ai: <title>AI Automation Invoice</title> <to>Mr. Assaf Mrad</to> <from>Glanis AI</from> <currency>$</currency> <item>Youtube Videos Summary Generator</item> <quantity>1</quantity> <cost>2500</cost> " +
                                          "<item>Auditing System</item> <quantity>3</quantity> <cost>500</cost>";

    public static async Task<Response?> SendToAiAsync(Request request)
    {
        var model = new Gemini15Flash(_geminiToken);
        model.SystemInstruction = _instructions;

        var resp = await model.GenerateContentAsync(_instructions + request.Message);
        if (string.IsNullOrWhiteSpace(resp))
        {
            return null;
        }
        Console.WriteLine(resp);
        return new Response(resp);
    }
}