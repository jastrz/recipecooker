namespace Core.Entities
{
    public class Recipe : BaseEntity
    {
        public string Name { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public List<Picture> PictureUrls { get; set; } = new();
        public List<RecipeTag> RecipeTags { get; set; } = new();
        public List<RecipeStep> Steps { get; set; } = new();
        public List<RecipeIngredient> RecipeIngredients { get; set; } = new();
    }
}