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
        private readonly IRecipeRepository _recipeRepository;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IGoogleService _googleService;
        private readonly ILogger<UserController> _logger;

        public UserController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
        IRecipeRepository recipeRepository, IUserService userService, IMapper mapper, IGoogleService googleService, ILogger<UserController> logger)
        {
            _logger = logger;
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
            _recipeRepository = recipeRepository;
            _mapper = mapper;
            _googleService = googleService;
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [HttpGet("username")]
        public async Task<ActionResult<string>> GetDisplayName([FromQuery] string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                return Ok(user.DisplayName);
            }
            else
            {
                return BadRequest($"Couldn't find user with {userId}");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized(new ApiResponse(401));
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return await _userService.GetUserDto(user);
        }

        [HttpPost("google")]
        public async Task<ActionResult<UserDto>> LoginWithGoogle([FromBody] GoogleLoginRequest request)
        {
            var payload = await _googleService.VerifyGoogleToken(request.IdToken);

            if (payload == null) return BadRequest("Couldn't get data from Google");

            var email = payload.Email;
            var existingUser = await _userManager.FindByEmailAsync(email);

            if (existingUser != null)
            {
                return await _userService.GetUserDto(existingUser);
            }
            else
            {
                var user = await _userService.CreateUser(payload.GivenName, email);
                if (user == null) return BadRequest(new ApiResponse(400));

                return await _userService.GetUserDto(user);
            }
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

            try
            {
                var user = await _userService.CreateUser(registerDto.DisplayName, registerDto.Email, registerDto.Password);
                return await _userService.GetUserDto(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse(400, ex.Message.ToString()));
            }
        }

        [Authorize]
        [HttpPost("changePassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordRequest changePasswordDto)
        {
            var user = await _userManager.Users
                            .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) return NotFound();

            var removeResult = await _userManager.RemovePasswordAsync(user);

            if (removeResult.Succeeded)
            {
                var setPasswordResult = await _userManager.AddPasswordAsync(user, changePasswordDto.Password);

                if (setPasswordResult.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest(new ApiResponse(400, setPasswordResult.ToString()));
                }
            }

            return BadRequest(new ApiResponse(400, "An error occurred while changing the password. Please try again."));
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            return await _userService.GetUserDto(user);
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

        [Authorize]
        [HttpPost]
        [Route("delete")]
        public async Task<ActionResult<bool>> DeleteUser()
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            var removed = await _userService.DeleteUser(user);

            return Ok(removed);
        }


    }
}