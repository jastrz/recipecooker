using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly CookerContext _context;

        public RecipeRepository(CookerContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Recipe>> GetRecipes()
        {
            var recipes = await _context.Recipes
                .Include(r => r.PictureUrls)
                .Include(r => r.RecipeTags)
                    .ThenInclude(rt => rt.Tag)
                        .ThenInclude(t => t.Category)
                .ToListAsync();

            return recipes;
        }

        public async Task<IReadOnlyList<RecipeStep>> GetRecipeSteps(int recipeId)
        {
            var recipeSteps = await _context.Steps.Where(s => s.RecipeId == recipeId)
                .ToListAsync();
            
            return recipeSteps;

        }

        public async Task<IReadOnlyList<Tag>> GetTags()
        {
            var tags = await _context.Tags
                .Include(t => t.Category)
                .ToListAsync();

            return tags;
        }
    }
}