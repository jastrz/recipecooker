namespace Core.Interfaces
{
    public interface IGPTService
    {
        Task<string> GetGPTResponse(string apiKey, string endpoint, string prompt, int maxTokens);
    }
}