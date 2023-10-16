using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly CookerContext _context;

        public RecipeService(CookerContext context)
        {
            _context = context;
        }

        public async Task AddRecipeAsync(Recipe recipe, List<RecipeStep> recipeSteps)
        {
            foreach (var recipeTag in recipe.RecipeTags)
            {
                HandleTagCategory(recipeTag);
                HandleTag(recipeTag);
            }

            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();

            recipeSteps.ForEach(step => step.RecipeId = recipe.Id);

            await _context.Steps.AddRangeAsync(recipeSteps);
            await _context.SaveChangesAsync();
        }

        private void HandleTagCategory(RecipeTag recipeTag)
        {
            var existingCategory = _context.Categories.FirstOrDefault(c => c.Name == recipeTag.Tag.Category.Name);

            if (existingCategory == null)
            {
                _context.Categories.Add(recipeTag.Tag.Category);
            }
            else
            {
                recipeTag.Tag.Category.Id = existingCategory.Id;
                recipeTag.Tag.Category = existingCategory;
            }
        }

        private void HandleTag(RecipeTag recipeTag)
        {
            var existingTag = _context.Tags.FirstOrDefault(t => t.Name == recipeTag.Tag.Name);

            if (existingTag == null)
            {
                _context.Tags.Add(recipeTag.Tag);
            }
            else
            {
                recipeTag.TagId = existingTag.Id;
                recipeTag.Tag = existingTag;
            }
        }
    }
}