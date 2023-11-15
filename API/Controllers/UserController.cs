using System.Security.Claims;
using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.Dtos;

namespace API.Controllers
{
    public class UserController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IRecipeRepository _recipeRepository;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService,
        IRecipeRepository recipeRepository, IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _recipeRepository = recipeRepository;
            _mapper = mapper;
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<Boolean>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized(new ApiResponse(401));
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.UserName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse
                {
                    Errors = new[]
                    {
                        "Email address is in use."
                    }
                });
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.UserName
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName,
                UserId = user.Id,
                SavedRecipeIds = user.SavedRecipeIds
            };
        }

        [Authorize]
        [HttpPatch]
        [Route("recipes/{recipeId}/save")]
        public async Task<ActionResult<IReadOnlyList<string>>> SaveRecipe([FromRoute] int recipeId, [FromBody] bool saved)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            await _userService.SetRecipeSaved(user, recipeId, saved);

            return Ok(user.SavedRecipeIds);
        }

        [Authorize]
        [HttpGet]
        [Route("recipes")]
        public async Task<IReadOnlyList<RecipeDto>> GetSavedRecipes()
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            List<Recipe> recipes = new();
            foreach (string id in user.SavedRecipeIds)
            {
                recipes.Add(await _recipeRepository.GetRecipeOverview(int.Parse(id)));
            }

            var data = _mapper.Map<IReadOnlyList<Recipe>, IReadOnlyList<RecipeDto>>(recipes);

            return data;
        }
    }
}