using Core.Interfaces;

namespace Core.Entities
{
    public enum RecipeStatus
    {
        Unverified,
        Verified,
        Archived
    }

    public class Recipe : BaseEntity, IEntityWithPictures
    {
        public string Name { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; } = 0;
        public RecipeStatus Status { get; set; } = RecipeStatus.Unverified;
        public List<Picture> Pictures { get; set; } = new();
        public List<RecipeTag> RecipeTags { get; set; } = new();
        public List<RecipeStep> Steps { get; set; } = new();
        public List<RecipeIngredient> RecipeIngredients { get; set; } = new();
        public List<Rating> Ratings { get; set; } = new();

        public double GetRating()
        {
            if (Ratings == null || Ratings.Count == 0) return 0;
            return Ratings.Average(r => r.Value);
        }
    }
}