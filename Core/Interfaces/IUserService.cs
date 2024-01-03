using Core.Entities.Identity;
using Core.Enums;

namespace Core.Interfaces
{
    public interface IUserService
    {
        Task SetRecipeSaved(AppUser user, int recipeId, bool saved);
        Task<List<string>> GetRolesForUserAsync(AppUser user);
        Task<bool> DeleteUser(AppUser user);
        Task UpdateTokenCount(AppUser user, int value = -1);
        Task<AppUser> CreateUser(string displayName, string email, string password = null, UserRole role = UserRole.User);

    }
}