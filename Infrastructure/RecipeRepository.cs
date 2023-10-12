using AutoMapper;
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
                .ToListAsync();

            return recipes;
        }

        public async Task<IReadOnlyList<Tag>> GetTags()
        {
            return await _context.Tags.ToListAsync();
        }
    }
}