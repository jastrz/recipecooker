namespace API.Dtos
{
    public class RecipeDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> PictureUrls { get; set; }
        public List<TagDto> RecipeTags { get; set; }
    }
}