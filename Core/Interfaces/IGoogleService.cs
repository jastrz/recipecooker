using Google.Apis.Auth;

namespace Core.Interfaces
{
    public interface IGoogleService
    {
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string idToken);
    }
}