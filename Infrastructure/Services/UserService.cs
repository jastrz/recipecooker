using Core.Entities.Identity;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using PasswordGenerator;
using Shared.Dtos;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppIdentityDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly Password password;

        public UserService(AppIdentityDbContext context, UserManager<AppUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _context = context;
            _tokenService = tokenService;
            password = new Password(16);
        }

        public async Task<AppUser> CreateUser(string displayName, string email, string password = null, UserRole role = UserRole.User)
        {
            if (password == null) password = this.password.Next();

            var user = new AppUser
            {
                DisplayName = displayName,
                Email = email,
                UserName = email
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create user: {errors}");
            }
            await _userManager.AddToRoleAsync(user, role.ToString());
            return user;
        }

        public async Task<UserDto> GetUserDto(AppUser user)
        {
            var roles = await GetRolesForUserAsync(user);
            var token = _tokenService.CreateToken(user, roles);

            var userDto = new UserDto
            {
                Email = user.Email,
                DisplayName = user.DisplayName,
                UserId = user.Id,
                SavedRecipeIds = user.SavedRecipeIds,
                Token = token,
                Roles = roles,
                TokenCount = user.TokenCount
            };

            return userDto;
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

        public async Task UpdateTokenCount(AppUser user, int value = -1)
        {
            user.TokenCount += value;

            await _context.SaveChangesAsync();
        }
    }
}