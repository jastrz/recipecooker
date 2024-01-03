using API.Dtos;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class ServerStatusController : BaseApiController
    {
        private readonly IRecipeGeneratorService _recipeGeneratorService;
        private readonly UserManager<AppUser> _userManager;

        public ServerStatusController(IRecipeGeneratorService recipeGeneratorService, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _recipeGeneratorService = recipeGeneratorService;
        }

        [HttpGet]
        public ActionResult<ServerStatusDto> GetServerStatus()
        {
            int userCount = _userManager.Users.Count();

            ServerStatusDto serverStatusData = new()
            {
                NumUsers = userCount,
                NumGenerated = _recipeGeneratorService.NumRecipesGenerated,
                MaxGenerated = _recipeGeneratorService.MaxRecipesGenerated
            };

            return Ok(serverStatusData);
        }
    }
}