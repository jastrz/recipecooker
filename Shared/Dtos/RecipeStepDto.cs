namespace Shared.Dtos
{
    public class RecipeStepDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> PictureUrls { get; set; }
    }
}