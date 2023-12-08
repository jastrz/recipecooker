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
        private readonly IGPTService _chatGPTService;
        private int maxTokens;
        private string key;
        private string endpoint;
        private readonly string descripiton = "random";
        private readonly string formattingPrompt = @"Formatting using: name, summary, descripiton. 
            Also give steps in format: id, name, description. 
            Add ingredients in format: name, quantity (number, e.g. don't write 1/4 - use 0.25 instead), unit (use EU measures)).
            Add tags based on generated recipe. Tags are contained in tags array, each tag has name and category. 
            Available categories: mainIngredient, origin, character.
            Return everything in json format, without comments or explainaitions.
            Never ignore any field, never return null, all fields must be filled. Don't add new fields.
            Watch for interpunction to keep JSON format correct.
            Act like master cook, recipe doesn't need to be simple.";

        public RecipeGeneratorService(ILogger<RecipeGeneratorService> logger, IConfiguration config, IGPTService chatGPTService)
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
            var response = await _chatGPTService.GetGPTResponse(key, endpoint, prompt, maxTokens);
            _logger.LogInformation(response);
            var dto = GetRecipeFromResponse(response);

            return dto;
        }

        public async Task<RecipeDto> GenerateRecipeFromRequest(RecipeGeneratorRequest request)
        {
            string prompt = GetPrompt(request);
            var response = await _chatGPTService.GetGPTResponse(key, endpoint, prompt, maxTokens);
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
    }
}