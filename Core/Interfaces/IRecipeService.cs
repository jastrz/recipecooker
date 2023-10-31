using Core.Entities;

namespace Core.Interfaces
{
    public interface IRecipeService
    {
        Task<Recipe> AddRecipeAsync(Recipe recipe);
    }
}