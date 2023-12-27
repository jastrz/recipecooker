using Shared.Enums;

namespace Shared.Dtos
{
    public class RecipeRequestHandlerResult
    {
        public ResponseStatus Status { get; set; }
        public RecipeDto Data { get; set; }
    }
}