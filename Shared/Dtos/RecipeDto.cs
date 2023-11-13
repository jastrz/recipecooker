namespace Shared.Dtos
{
    public class RecipeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public double Rating { get; set; }
        public List<string> PictureUrls { get; set; }
        public List<TagDto> Tags { get; set; }
        public List<RecipeStepDto> Steps { get; set; }
        public List<IngredientDto> Ingredients { get; set; }
    }
}