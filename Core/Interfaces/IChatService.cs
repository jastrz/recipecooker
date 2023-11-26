using Core.Entities;
using Shared.Dtos;

namespace Core.Interfaces
{
    public interface IChatService
    {
        Task<RecipeDto> GetRandomRecipe();
        Task<string> GetChatGPTResponse(string apiKey, string endpoint, string prompt, int maxTokens);
        string JsonRecipe();
    }
}