using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure.Identity;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppIdentityDbContext _context;

        public UserService(AppIdentityDbContext context)
        {
            _context = context;
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