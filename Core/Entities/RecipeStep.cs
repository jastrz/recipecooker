namespace Core.Entities
{
    public class RecipeStep : BaseEntity
    {
        // public int Sequence { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int RecipeId { get; set; }
        public List<Picture> PictureUrls { get; set; } = new();
    }
}