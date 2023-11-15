namespace Shared.Dtos
{
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string UserId { get; set; }
        public List<string> SavedRecipeIds { get; set; } = new();
    }
}