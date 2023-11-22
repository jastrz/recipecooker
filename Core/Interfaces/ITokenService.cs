using Core.Entities.Identity;
using Google.Apis.Auth;
using Shared.Dtos;

namespace Core.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string idToken);
    }
}