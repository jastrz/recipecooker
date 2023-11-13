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

        public async Task<Recipe> GetRecipe(int id)
        {
            var recipe = await _context.Recipes
                .Where(r => r.Id == id)
                .Include(r => r.Pictures)
                .Include(r => r.Steps)
                    .ThenInclude(s => s.Pictures)
                .Include(r => r.RecipeTags)
                    .ThenInclude(r => r.Tag)
                        .ThenInclude(r => r.Category)
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(r => r.Ingredient)
                .Include(r => r.Ratings)
                .FirstOrDefaultAsync();

            return recipe;
        }

        public async Task<IReadOnlyList<Recipe>> GetRecipesOverview()
        {
            var recipes = await _context.Recipes
                .Include(r => r.Pictures)
                .Include(r => r.RecipeTags)
                    .ThenInclude(rt => rt.Tag)
                        .ThenInclude(t => t.Category)
                .ToListAsync();

            return recipes;
        }

        public async Task<IReadOnlyList<Recipe>> GetRecipes()
        {
            var recipes = await _context.Recipes
                .Include(r => r.Pictures)
                .Include(r => r.Steps)
                .Include(r => r.RecipeTags)
                    .ThenInclude(rt => rt.Tag)
                        .ThenInclude(t => t.Category)
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(r => r.Ingredient)
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

            var sortedTags = tags.AsEnumerable()
                .OrderBy(t => t.Category.Name switch
                {
                    "mainIngredient" => 1,
                    "origin" => 2,
                    "character" => 3,
                    _ => 4
                })
                .ThenBy(t => t.Category.Name)
                .ToList();

            return sortedTags;
        }


    }
}