using Core.Interfaces;

namespace Core.Entities
{
    public class RecipeStep : BaseEntity, IEntityWithPictures
    {
        // public int Sequence { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int RecipeId { get; set; }
        public List<Picture> Pictures { get; set; } = new();
    }
}