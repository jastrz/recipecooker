using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public static class Utils
    {
        public async static Task RemoveNonExistentTags(IServiceScope scope)
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