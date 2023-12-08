using Shared.Dtos;

namespace Core.Interfaces
{
    public interface IRecipeGeneratorService
    {
        Task<RecipeDto> GetRandomRecipe();
        Task<RecipeDto> GenerateRecipeFromRequest(RecipeGeneratorRequest request);
    }
}