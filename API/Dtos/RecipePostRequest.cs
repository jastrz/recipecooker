using Core.Entities;

namespace API.Dtos
{
    public class RecipePostRequest
    {
        public RecipeDto Recipe { get; set; }
        public List<RecipeStep> RecipeSteps { get; set; }
    }
}