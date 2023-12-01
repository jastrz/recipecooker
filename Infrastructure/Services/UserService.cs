using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppIdentityDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public UserService(AppIdentityDbContext context, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<bool> DeleteUser(AppUser user)
        {
            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded) return true;
            else return false;
        }

        public async Task<List<string>> GetRolesForUserAsync(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            return roles.ToList();
        }

        public async Task SetRecipeSaved(AppUser user, int recipeId, bool saved)
        {
            string id = recipeId.ToString();
            if (saved && !user.SavedRecipeIds.Contains(id))
                user.AddSavedRecipe(id);
            else if (!saved && user.SavedRecipeIds.Contains(id))
                user.RemoveSavedRecipe(id);

            await _context.SaveChangesAsync();
        }
    }
}