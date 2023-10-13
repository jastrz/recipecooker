using Core.Entities;

namespace Infrastructure.Dtos
{
    public class RecipeDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> PictureUrls { get; set; }
        public List<TagDto> RecipeTags { get; set; }
    }

    public class TagDto 
    {
        public string Name { get; set; }
        public string Category { get; set; }
    }
}