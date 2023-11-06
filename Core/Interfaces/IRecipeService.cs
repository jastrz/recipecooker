using Core.Entities;

namespace Core.Interfaces
{
    public interface IRecipeService
    {
        Task<Recipe> AddRecipeAsync(Recipe recipe);
        Task AddImagesToRecipe(Recipe recipe, List<string> imageUrls);
        Task AddImagesToRecipeStep(RecipeStep step, List<string> imageUrls);
    }
}