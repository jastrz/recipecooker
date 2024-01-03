using Shared.Dtos;

namespace Core.Interfaces
{
    public interface IRecipeGeneratorService
    {
        int MaxRecipesGenerated { get; }
        int NumRecipesGenerated { get; }
        Task<RecipeDto> GetRandomRecipe();
        Task<RecipeDto> GenerateRecipeFromRequest(RecipeGeneratorRequest request);
    }
}