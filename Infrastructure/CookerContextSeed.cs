using System.Reflection;
using System.Text.Json;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Shared.Dtos;

namespace Infrastructure
{
    public class CookerContextSeed
    {
        private readonly IRecipeService _recipeService;
        private readonly IMapper _mapper;
        public CookerContextSeed(IRecipeService recipeService, IMapper mapper)
        {
            _mapper = mapper;
            _recipeService = recipeService;
        }

        public async Task SeedAsync(CookerContext context)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!context.Recipes.Any())
            {
                var recipesData = File.ReadAllText(path + @"/Data/SeedData/recipes.json");
                var recipes = JsonSerializer.Deserialize<List<RecipeDto>>(recipesData,
                    new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

                foreach (var recipeDto in recipes)
                {
                    var recipe = _mapper.Map<RecipeDto, Recipe>(recipeDto);
                    await _recipeService.AddRecipeAsync(recipe);
                }
            }

            if (context.ChangeTracker.HasChanges())
                await context.SaveChangesAsync();
        }
    }
}