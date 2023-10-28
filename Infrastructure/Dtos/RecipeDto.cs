using Core.Entities;

namespace Infrastructure.Dtos
{
    public class RecipeDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> PictureUrls { get; set; }
        public List<TagDto> Tags { get; set; }
        public List<RecipeStep> Steps { get; set; }
        public List<IngredientDto> Ingredients { get; set; }
    }

    public class TagDto 
    {
        public string Name { get; set; }
        public string Category { get; set; }
    }

    public class IngredientDto
    {
        public string Name { get; set; }
        public string Unit { get; set; }
        public decimal Quantity { get; set; }
    }
}