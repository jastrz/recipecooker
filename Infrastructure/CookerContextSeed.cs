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
                var recipes = JsonSerializer.Deserialize<List<RecipeDto>>(recipesData, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

                // recipes.ForEach(async r => 
                // {
                //     await _recipeService.AddRecipeAsync(r);
                //     await context.SaveChangesAsync();
                // });
                // var recipes = new List<Recipe>
                // {
                //     GetRecipe("some", "yummy"),
                //     GetRecipe("other", "yummy too!")
                // };

                foreach (var recipeDto in recipes)
                {
                    var recipe = _mapper.Map<RecipeDto, Recipe>(recipeDto);
                    await _recipeService.AddRecipeAsync(recipe);
                }
            }

            if (context.ChangeTracker.HasChanges())
                await context.SaveChangesAsync();
        }

        private Recipe GetRecipe(string name, string description)
        {
            Recipe recipe = new Recipe();
            recipe.Pictures.Add(new Picture() { Url = "someurl" });
            recipe.Name = "somename";
            recipe.Description = "somedescription";
            recipe.RecipeTags = new List<RecipeTag>
                {
                    new RecipeTag
                    {
                        Tag = new Tag()
                        {
                            Name = "tag",
                            //Type = "type"
                        }
                    },
                    new RecipeTag
                    {
                        Tag = new Tag()
                        {
                            Name = "tag2",
                            //Type = "type2"
                        }
                    }
                };

            return recipe;
        }
    }
}