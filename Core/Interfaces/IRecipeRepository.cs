using Core.Entities;

namespace Core.Interfaces
{
    public interface IRecipeRepository
    {
        Task<IReadOnlyList<Recipe>> GetRecipes();
    }
}