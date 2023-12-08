using Core.Entities.Identity;
using Google.Apis.Auth;

namespace Core.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}