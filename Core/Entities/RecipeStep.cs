namespace Core.Entities
{
    public record RecipeStep(int Sequence, string Name, string Description) {
        public int RecipeId { get; set; }
    }
}