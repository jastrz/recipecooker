using System.Text.Json;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Shared.Dtos;

namespace Infrastructure.Services
{
    public class RecipeGeneratorService : IRecipeGeneratorService
    {
        private readonly ILogger<RecipeGeneratorService> _logger;
        private readonly IConfiguration _config;
        private readonly IChatGPTService _chatGPTService;
        private string key;
        private string endpoint;
        private int maxTokens;
        private readonly string descripiton = "random";
        private readonly string formattingPrompt = @"Formatting using: name, summary, descripiton. 
            Also give steps in format: id, name, description. 
            Add ingredients in format: name, quantity (number, e.g. don't write 1/4 - use 0.25 instead), unit (use EU measures)).
            Add tags based on generated recipe. Tags are contained in tags array, each tag has name and category. 
            Available categories: mainIngredient, origin, character - all must be filled.
            Return everything in json format, without comments or explainaitions.
            Never ignore any field, never return null, all fields must be filled. Don't add new fields.
            Watch for interpunction to keep JSON format correct.
            Act like master cook, recipe doesn't need to be simple.";

        public RecipeGeneratorService(ILogger<RecipeGeneratorService> logger, IConfiguration config, IChatGPTService chatGPTService)
        {
            _chatGPTService = chatGPTService;
            _config = config;
            _logger = logger;

            key = _config["OpenAI:Secret"];
            endpoint = _config["OpenAI:Endpoint"];
            maxTokens = _config.GetValue<int>("OpenAI:MaxTokens");
        }

        public async Task<RecipeDto> GetRandomRecipe()
        {
            string prompt = GetPrompt();
            var response = await _chatGPTService.GetChatGPTResponse(key, endpoint, prompt, maxTokens);
            _logger.LogInformation(response);
            var dto = GetRecipeFromResponse(response);

            return dto;
        }

        public async Task<RecipeDto> GenerateRecipeFromRequest(RecipeGeneratorRequest request)
        {
            string prompt = GetPrompt(request);
            var response = await _chatGPTService.GetChatGPTResponse(key, endpoint, prompt, maxTokens);
            _logger.LogInformation(response);
            var dto = GetRecipeFromResponse(response);

            return dto;
        }

        private string GetPrompt(RecipeGeneratorRequest? request = null)
        {
            string descripiton = this.descripiton;
            if (request.Description != null && request.Description.Length > 0)
            {
                descripiton = request.Description;
            }

            string prompt = @$"write {descripiton} recipe." + formattingPrompt;

            return prompt.Replace("\n", "").Replace("\r", "");
        }

        private RecipeDto GetRecipeFromResponse(string response)
        {
            try
            {
                var dto = JsonSerializer.Deserialize<RecipeDto>(response, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    DefaultBufferSize = 8192,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                });

                return dto;
            }
            catch
            {
                throw new Exception("Error occurred while converting gpt response to recipe.");
            }
        }




        ////////////////////////////////////////////////////////////////////////////////


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