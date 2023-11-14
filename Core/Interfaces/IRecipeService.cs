using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IRecipeService
    {
        Task<Recipe> AddRecipeAsync(Recipe recipe);
        Task AddImagesToRecipe(Recipe recipe, List<string> imageUrls);
        Task AddImagesToRecipeStep(RecipeStep step, List<string> imageUrls);
        Task UpdateRecipeRating(Recipe recipe, double rating, string userId);
        IReadOnlyList<Recipe> FilterRecipes(IReadOnlyList<Recipe> recipes, RecipeTagParams @params);
    }
}