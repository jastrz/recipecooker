using Core.Interfaces;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class GoogleService : IGoogleService
    {
        private readonly IConfiguration _config;

        public GoogleService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string idToken)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _config["GoogleAuthentication:ClientId"] }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }
    }
}