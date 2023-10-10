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
            return await _context.Recipes.ToListAsync();
        }
    }
}