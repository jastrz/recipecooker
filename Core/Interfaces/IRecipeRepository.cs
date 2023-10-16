using Core.Entities;

namespace Core.Interfaces
{
    public interface IRecipeRepository
    {
        Task<IReadOnlyList<Recipe>> GetRecipes();
        Task<IReadOnlyList<RecipeStep>> GetRecipeSteps(int recipeId);
        Task<IReadOnlyList<Tag>> GetTags();
    }
}