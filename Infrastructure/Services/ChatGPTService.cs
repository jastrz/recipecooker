using System.Text;
using Core.Interfaces;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace Infrastructure.Services
{
    public class ChatGPTService : IChatGPTService
    {
        private readonly ILogger<ChatGPTService> _logger;

        public ChatGPTService(ILogger<ChatGPTService> logger)
        {
            _logger = logger;
        }

        public async Task<string> GetChatGPTResponse(string apiKey, string endpoint, string prompt, int maxTokens)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
                string requestData = $"{{\"model\": \"gpt-3.5-turbo\", \"messages\": [{{\"role\": \"system\", \"content\": \"You are a helpful assistant.\"}}, {{\"role\": \"user\", \"content\": \"{prompt}\"}}], \"max_tokens\": {maxTokens}}}";
                StringContent content = new StringContent(requestData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(endpoint, content);
                string responseString = await response.Content.ReadAsStringAsync();
                var jsonObject = JObject.Parse(responseString);
                _logger.LogInformation(responseString);
                string responseContent = jsonObject["choices"][0]["message"]["content"].ToString();

                return responseContent;
            }
        }
    }
}