using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string SavedRecipes { get; set; }

        [NotMapped]
        public List<string> SavedRecipeIds
        {
            get => SavedRecipes?.Split(',').ToList() ?? new List<string>();
        }

        public void AddSavedRecipe(string id)
        {
            if (SavedRecipeIds.Contains(id))
                return;

            if (SavedRecipes == null)
                SavedRecipes = id;
            else
                SavedRecipes += "," + id;
        }

        public void RemoveSavedRecipe(string id)
        {
            if (SavedRecipes == null)
                return;

            var recipeIds = SavedRecipeIds;
            recipeIds.Remove(id);

            SavedRecipes = string.Join(',', recipeIds);
        }
    }
}
