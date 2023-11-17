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
            get => (SavedRecipes != null && SavedRecipes.Length > 0)
                ? SavedRecipes.Split(',').ToList()
                : new List<string>();
        }

        public void AddSavedRecipe(string id)
        {
            if (SavedRecipeIds.Contains(id))
                return;

            if (SavedRecipes == null || SavedRecipes.Length == 0)
                SavedRecipes = id;
            else
                SavedRecipes += "," + id;
        }

        public void RemoveSavedRecipe(string id)
        {
            if (SavedRecipes == null)
                return;

            var savedRecipeIds = SavedRecipeIds;
            savedRecipeIds.Remove(id);
            SavedRecipes = string.Join(',', savedRecipeIds);
        }
    }
}
