namespace Core.Entities
{
    public class Ingredient : BaseEntity
    {
        public string Name { get; set; }
        public string Unit { get; set; }
        public List<RecipeIngredient> RecipeIngredients { get; set; }
    }
}