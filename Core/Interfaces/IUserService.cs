using Core.Entities.Identity;

namespace Core.Interfaces
{
    public interface IUserService
    {
        Task SetRecipeSaved(AppUser user, int recipeId, bool saved);
    }
}