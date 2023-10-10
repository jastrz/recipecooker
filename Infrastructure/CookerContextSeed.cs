using Core.Entities;

namespace Infrastructure
{
    public class CookerContextSeed
    {
        public static async Task SeedAsync(CookerContext context)
        {
            if(!context.Recipes.Any())
            {
                var recipes = new List<Recipe>
                {
                    new Recipe
                    {
                        Name = "Spaghetti Bolognese",
                        Description = "Classic Italian pasta dish with a rich meaty sauce."
                    },
                    new Recipe
                    {
                        Name = "Chicken Alfredo",
                        Description = "Creamy pasta dish with tender chicken and a parmesan cheese sauce."
                    },
                    new Recipe
                    {
                        Name = "Vegetable Stir-Fry",
                        Description = "Healthy stir-fried vegetables with a savory soy sauce."
                    },
                    new Recipe
                    {
                        Name = "Grilled Salmon",
                        Description = "Delicious grilled salmon fillet with lemon and herbs."
                    },
                    new Recipe
                    {
                        Name = "Homemade Pizza",
                        Description = "Make your own pizza with your favorite toppings and cheese."
                    }
                };
                context.AddRange(recipes);
            }

            if(context.ChangeTracker.HasChanges())
                await context.SaveChangesAsync();
        }        
    }
}