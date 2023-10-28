namespace Core.Entities
{
    public class RecipeStep 
    {
        public int Sequence { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int RecipeId { get; set; }
    }
}