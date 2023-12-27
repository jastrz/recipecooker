using Core.Entities.Identity;
using Infrastructure;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public static class InitializationUtils
    {
        public static async Task Initialize(this WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var cookerContext = services.GetRequiredService<CookerContext>();
                var identityContext = services.GetRequiredService<AppIdentityDbContext>();
                var userManager = services.GetRequiredService<UserManager<AppUser>>();

                var logger = services.GetRequiredService<ILogger<Program>>();

                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var roles = Enum.GetNames(typeof(Core.Enums.UserRole));

                try
                {
                    await cookerContext.Database.MigrateAsync();
                    await InitializeRecipes(services, cookerContext);
                    await identityContext.Database.MigrateAsync();
                    await CreateRoles(roleManager, roles);
                    await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error during migration.");
                }
            }

            using (var scope = app.Services.CreateScope())
            {
                await RemoveNonExistentTags(scope);
            }
        }

        static async Task CreateRoles(RoleManager<IdentityRole> roleManager, string[] roles)
        {
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        static async Task InitializeRecipes(IServiceProvider services, CookerContext cookerContext)
        {
            if (cookerContext.Recipes.Count() == 0)
            {
                var cookerContextSeed = services.GetRequiredService<CookerContextSeed>();
                await cookerContextSeed.SeedAsync(cookerContext);
            }
        }

        async static Task RemoveNonExistentTags(IServiceScope scope)
        {
            var services = scope.ServiceProvider;
            var cookerContext = services.GetRequiredService<CookerContext>();
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogWarning("Removing nonexistent tags.");

            var recipes = cookerContext.Recipes;
            var allTagsInRecipes = recipes
                    .Include(r => r.RecipeTags)
                        .ThenInclude(r => r.Tag)
                .SelectMany(x => x.RecipeTags)
                .Select(y => y.Tag.Name).Distinct().ToList();

            var recipeTags = cookerContext.RecipeTag
                .Include(t => t.Tag).ToList();

            for (int i = recipeTags.Count() - 1; i >= 0; i--)
            {
                if (!allTagsInRecipes.Contains(recipeTags[i].Tag.Name))
                {
                    logger.LogError(recipeTags[i].Tag.Name);
                    cookerContext.Tags.Remove(recipeTags[i].Tag);
                }
            }

            var tags = cookerContext.Tags.ToList();

            for (int i = tags.Count() - 1; i >= 0; i--)
            {
                if (!allTagsInRecipes.Contains(tags[i].Name))
                {
                    cookerContext.Remove(tags[i]);
                }
            }

            await cookerContext.SaveChangesAsync();
        }
    }
}