using System.Text.Json;
using Core.Interfaces;
using Infrastructure.Helpers;
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
        private readonly string randomRecipeDescription = "random";
        private readonly string formattingPrompt = @"Formatting using: name, summary, descripiton. 
            Also give steps in format: id, name, description. 
            Add ingredients in format: name, quantity (number, e.g. don't write 1/4 - use 0.25 instead), unit (use EU measures)).
            Add tags based on generated recipe. Tags are contained in tags array, each tag has name and category. 
            Available categories: mainIngredient, origin, character.
            Return everything in json format, without comments or explainaitions.
            Never ignore any field, never return null, all fields must be filled. Don't add new fields.
            Watch for interpunction and commas after each fields that need it to keep JSON format correct.
            Act like master cook, recipe doesn't need to be simple.";

        private readonly int maxTries = 2;

        public RecipeGeneratorService(ILogger<RecipeGeneratorService> logger, IConfiguration config, IGPTService chatGPTService)
        {
            _chatGPTService = chatGPTService;
            _config = config;
            _logger = logger;

            key = _config["OpenAI:Secret"];
            endpoint = _config["OpenAI:Endpoint"];
            maxTokens = _config.GetValue<int>("OpenAI:MaxTokens");
        }

        public async Task<RecipeDto> GenerateRecipeFromRequest(RecipeGeneratorRequest request)
        {
            string prompt = GetPrompt(request);
            int numTries = maxTries;

            while (numTries > 0)
            {
                try
                {
                    var response = await _chatGPTService.GetGPTResponse(key, endpoint, prompt, maxTokens);
                    var dto = await GetRecipeFromResponse(response);
                    return dto;
                }
                catch
                {
                    numTries--;
                    _logger.LogInformation($"Getting recipe failed. Tries remaining: {numTries}");
                }
            }

            throw new Exception("Couldn't generate recipe");
        }

        public async Task<RecipeDto> GetRandomRecipe()
        {
            return await GenerateRecipeFromRequest(new RecipeGeneratorRequest { Description = this.randomRecipeDescription });
        }

        private string GetPrompt(RecipeGeneratorRequest? request = null)
        {
            string descripiton = this.randomRecipeDescription;
            if (request.Description != null && request.Description.Length > 0)
            {
                descripiton = request.Description;
            }

            string prompt = @$"write {descripiton} recipe." + formattingPrompt;

            return prompt.Replace("\n", "").Replace("\r", "");
        }

        private async Task<RecipeDto> GetRecipeFromResponse(string response)
        {
            RecipeDto dto;

            try
            {
                if (!Utils.IsValidJson(response))
                {
                    _logger.LogError("Invalid json!");
                    response = await GetCorrectedResponse(response);
                }

                dto = MapResponseToRecipe(response);

                return dto;
            }
            catch
            {
                throw;
            }
        }

        private RecipeDto MapResponseToRecipe(string response)
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

        private async Task<string> GetCorrectedResponse(string response)
        {
            // :) todo: fix possible json mistakes or get response in another format from gpt

            return response;
        }
    }
}