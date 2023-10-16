using Core.Entities;

namespace Core.Interfaces
{
    public interface IRecipeService
    {
        Task AddRecipeAsync(Recipe recipe, List<RecipeStep> recipeSteps);
    }
}