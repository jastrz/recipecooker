using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IChatGPTService
    {
        Task<string> GetChatGPTResponse(string apiKey, string endpoint, string prompt, int maxTokens);
    }
}