using Core.Entities;

namespace Core.Interfaces
{
    public interface IRecipeRepository
    {
        Task<IReadOnlyList<Recipe>> GetRecipes();
        Task<IReadOnlyList<Recipe>> GetRecipesOverview();
        Task<Recipe> GetRecipe(int id);
        Task<IReadOnlyList<RecipeStep>> GetRecipeSteps(int id);
        Task<IReadOnlyList<Tag>> GetTags();
    }
}