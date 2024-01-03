using Core.Entities.Identity;
using Core.Enums;

namespace Core.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user, IList<string> userRoles);
    }
}