namespace Core.Entities
{
    public class Tag : BaseEntity
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public List<RecipeTag> RecipeTags { get; set; } = new();
    }
}