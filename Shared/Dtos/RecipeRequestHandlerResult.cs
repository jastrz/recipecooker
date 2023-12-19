namespace Shared.Dtos
{
    public enum ResponseStatus
    {
        Success,
        InsufficentTokens,
        Unauthorized,
        Failure
    }

    public class RecipeRequestHandlerResult
    {
        public ResponseStatus Status { get; set; }
        public RecipeDto Data { get; set; }
    }
}