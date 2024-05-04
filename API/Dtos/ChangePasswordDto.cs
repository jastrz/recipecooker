namespace API.Dtos
{
    public class ChangePasswordRequest
    {
        public string Password { get; set; }
        public string RepeatPassword { get; set; } // currently not used
    }
}