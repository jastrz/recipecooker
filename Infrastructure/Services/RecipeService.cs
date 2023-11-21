using Core.Entities;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly CookerContext _context;

        public RecipeService(CookerContext context)
        {
            _context = context;
        }

        public async Task<Recipe> AddRecipeAsync(Recipe recipe)
        {
            foreach (var recipeTag in recipe.RecipeTags)
            {
                HandleTagCategory(recipeTag);
                HandleTag(recipeTag);
            }

            foreach (var recipeIngredient in recipe.RecipeIngredients)
            {
                HandleIngredient(recipeIngredient);
            }

            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();

            return recipe;
        }

        public async Task AddImagesToRecipe(Recipe recipe, List<string> pictureUrls)
        {
            pictureUrls.ForEach(url => recipe.Pictures.Add(new Picture { Url = url }));
            await _context.SaveChangesAsync();
        }

        public async Task AddImagesToRecipeStep(RecipeStep recipeStep, List<string> pictureUrls)
        {
            pictureUrls.ForEach(url => recipeStep.Pictures.Add(new Picture { Url = url }));
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRecipeRating(Recipe recipe, double rating, string userId)
        {
            var existingRating = recipe.Ratings.Find(x => x.UserId == userId);
            if (existingRating != null)
            {
                existingRating.Value = rating;
            }
            else
            {
                recipe.Ratings.Add(new Rating(rating, userId));
            }

            await _context.SaveChangesAsync();
        }

        public IReadOnlyList<Recipe> FilterRecipes(IReadOnlyList<Recipe> recipes, RecipeSearchParams @params)
        {
            if (!string.IsNullOrEmpty(@params.Character))
                recipes = recipes.Where(recipe => recipe.RecipeTags.Any(rt => rt.Tag.Name == @params.Character)).ToList();
            if (!string.IsNullOrEmpty(@params.MainIngredient))
                recipes = recipes.Where(recipe => recipe.RecipeTags.Any(rt => rt.Tag.Name == @params.MainIngredient)).ToList();
            if (!string.IsNullOrEmpty(@params.Origin))
                recipes = recipes.Where(recipe => recipe.RecipeTags.Any(rt => rt.Tag.Name == @params.Origin)).ToList();

            RecipeStatus status;
            if (Enum.TryParse(@params.Status, out status))
            {
                recipes = recipes.Where(recipe => recipe.Status == status).ToList();
            }

            return recipes;
        }

        private void HandleIngredient(RecipeIngredient recipeIngredient)
        {
            var existingIngredient = _context.Ingredients.FirstOrDefault(i => i.Name == recipeIngredient.Ingredient.Name);

            if (existingIngredient == null)
            {
                _context.Ingredients.Add(recipeIngredient.Ingredient);
            }
            else
            {
                recipeIngredient.IngredientId = existingIngredient.Id;
                recipeIngredient.Ingredient = existingIngredient;
            }
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

        public async Task<bool> UpdateRecipeStatus(Recipe recipe, string statusString)
        {
            RecipeStatus status;
            if (Enum.TryParse(statusString, out status))
            {
                recipe.Status = status;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task RemoveRecipe(Recipe recipe)
        {
            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRecipe(Recipe from, Recipe to)
        {
            _context.Entry(from).CurrentValues.SetValues(to);
            from.Pictures = to.Pictures;
            from.Steps = to.Steps;

            await _context.SaveChangesAsync();
        }
    }
}