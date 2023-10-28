using Core.Entities;
using Infrastructure.Dtos;

namespace API.Dtos
{
    public class RecipeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> PictureUrls { get; set; }
        public List<TagDto> RecipeTags { get; set; }
        public List<RecipeStep> Steps { get; set; }
        public List<IngredientDto> Ingredients { get; set; }
    }
}