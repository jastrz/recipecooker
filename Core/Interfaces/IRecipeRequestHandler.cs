using Core.Entities.Identity;
using Shared.Dtos;

namespace Core.Interfaces
{
    public interface IRecipeRequestHandler
    {
        Task<RecipeRequestHandlerResult> GenerateRecipeForUser(RecipeGeneratorRequest? request, AppUser user, int tokenPrice);
        Task<RecipeRequestHandlerResult> GenerateRecipe(RecipeGeneratorRequest? request, string ownerId = null);
    }
}