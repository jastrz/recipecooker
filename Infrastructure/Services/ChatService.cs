using System.Text;
using System.Text.Json;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Shared.Dtos;

namespace Infrastructure.Services
{
    public class ChatService : IChatService
    {
        private readonly ILogger<ChatService> _logger;
        private readonly IConfiguration _config;

        public ChatService(ILogger<ChatService> logger, IConfiguration config)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<string> GetChatGPTResponse(string apiKey, string endpoint, string prompt, int maxTokens)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
                string requestData = $"{{\"model\": \"gpt-3.5-turbo\", \"messages\": [{{\"role\": \"system\", \"content\": \"You are a helpful assistant.\"}}, {{\"role\": \"user\", \"content\": \"{prompt}\"}}], \"max_tokens\": {maxTokens}}}";
                StringContent content = new StringContent(requestData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(endpoint, content);
                string responseString = await response.Content.ReadAsStringAsync();
                var jsonObject = JObject.Parse(responseString);
                this._logger.LogInformation(responseString);
                string responseContent = jsonObject["choices"][0]["message"]["content"].ToString();

                return responseContent;
            }
        }


        public async Task<RecipeDto> GetRandomRecipe()
        {
            var key = _config["OpenAI:Secret"];
            string endpoint = _config["OpenAI:Endpoint"];
            string prompt = this.prompt.Replace("\n", "").Replace("\r", "");
            int maxTokens = 1000;

            var response = await GetChatGPTResponse(key, endpoint, prompt, maxTokens);

            _logger.LogInformation(response);

            var dto = JsonSerializer.Deserialize<RecipeDto>(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultBufferSize = 8192,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true
            });

            return dto;
        }

        string prompt = @"write nice chicken stock based recipe 
            formatting using: name, summary, descripiton. 
            Also give steps in format: id, name, description. 
            To the response add ingredients in format: name, quantity (number, e.g. don't write 1/4 - use 0.25 instead), unit (use EU measures))
            Return everything in json format, without comments or explanaitions.
            Never ignore any field, never return null, all fields must be filled. Don't add new fields.
            Act like master cook, recipes doesnt need to be simple.";

        public string JsonRecipe() => jsonRecipe;

        public string jsonRecipe = @"{
    ""name"": ""Asian-Style Beef with Soy Sauce"",
    ""summary"": ""A flavorful and tender beef dish with an Asian twist, cooked in a rich soy sauce marinade."",
    ""description"": ""This recipe combines tender beef with a savory soy sauce marinade, resulting in a delicious Asian-inspired dish. The beef is marinated in a mixture of soy sauce, garlic, ginger, and sesame oil, which infuses it with incredible flavor. The beef is then stir-fried with vegetables and simmered in the remaining marinade, creating a rich and glossy sauce. Serve this dish with steamed rice or noodles for a satisfying and tasty meal."",

    ""ingredients"": [
        { ""name"": ""Beef"", ""quantity"": 500, ""unit"": ""grams"" },
        { ""name"": ""Soy Sauce"", ""quantity"": 4, ""unit"": ""tablespoons"" },
        { ""name"": ""Garlic"", ""quantity"": 4, ""unit"": ""cloves"" },
        { ""name"": ""Ginger"", ""quantity"": 1, ""unit"": ""thumb-sized piece"" },
        { ""name"": ""Sesame Oil"", ""quantity"": 2, ""unit"": ""tablespoons"" },
        { ""name"": ""Vegetable Oil"", ""quantity"": 2, ""unit"": ""tablespoons"" },
        { ""name"": ""Broccoli"", ""quantity"": 1, ""unit"": ""head"" },
        { ""name"": ""Carrots"", ""quantity"": 2, ""unit"": ""large"" },
        { ""name"": ""Red Bell Pepper"", ""quantity"": 1, ""unit"": ""large"" },
        { ""name"": ""Green Onions"", ""quantity"": 4, ""unit"": ""stalks"" },
        { ""name"": ""Cornstarch"", ""quantity"": 0.25, ""unit"": ""tablespoon"" },
        { ""name"": ""Water"", ""quantity"": 4, ""unit"": ""cup"" }
    ],

    ""steps"": [
        { ""name"": ""Marinate the Beef"",
            ""description"": ""In a bowl, combine the soy sauce, minced garlic, grated ginger, and sesame oil. Cut the beef into thin slices against the grain, then add it to the marinade. Toss to coat the beef evenly. Leave to marinate for at least 30 minutes, or refrigerate overnight for a more intense flavor."" },

        { ""name"": ""Prepare the Vegetables"",
            ""description"": ""Cut the broccoli into florets, peel and slice the carrots into thin strips, and thinly slice the red bell pepper. Trim and slice the green onions into small pieces."" },

        { ""name"": ""Cook the Beef and Vegetables"",
            ""description"": ""In a large skillet or wok, heat the vegetable oil over high heat. Remove the beef from the marinade, reserving the marinade. Stir-fry the beef in the hot oil for 2-3 minutes, until browned. Remove the beef from the skillet. In the same skillet, add the prepared vegetables and stir-fry for 2-3 minutes, until they start to soften."" },

        { ""name"": ""Simmer in the Marinade"",
            ""description"": ""Return the beef to the skillet with the vegetables. Pour in the reserved marinade and stir to coat everything evenly. In a small bowl, whisk together the cornstarch and water until smooth. Pour the cornstarch mixture into the skillet and stir well. Reduce the heat to medium and simmer for an additional 2-3 minutes, or until the sauce has thickened and the beef and vegetables are cooked to your desired tenderness."" },

        { ""name"": ""Serve and Enjoy"",
            ""description"": ""Transfer the Asian-style beef with soy sauce to a serving dish. Garnish with additional sliced green onions, if desired. Serve hot with steamed rice or noodles for a complete meal."" }
    ]
}";

    }
}