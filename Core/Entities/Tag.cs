namespace Core.Entities
{
    public class Tag : BaseEntity
    {
        public string Name { get; set; }
        public Category Category {get; set; }
        public List<RecipeTag> RecipeTags { get; set; } = new();
    }
}