using System.Security.Claims;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.Dtos;

namespace API.Controllers
{
    public class RecipesController : BaseApiController
    {
        private readonly IRecipeRepository _recipeRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<RecipesController> _logger;
        private readonly IRecipeService _recipeService;
        private readonly IFileService _fileService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IRecipeRequestHandler _recipeRequestHandler;

        public RecipesController(IRecipeRepository recipeRepo, IMapper mapper, ILogger<RecipesController> logger,
         IRecipeService recipeService, IFileService fileUploadService, UserManager<AppUser> userManager, IConfiguration config,
         IRecipeRequestHandler recipeRequestHandler)
        {
            _recipeRequestHandler = recipeRequestHandler;
            _userManager = userManager;
            _fileService = fileUploadService;
            _recipeService = recipeService;
            _logger = logger;
            _recipeRepo = recipeRepo;
            _mapper = mapper;
            _config = config;
        }

        [HttpGet]
        public async Task<IReadOnlyList<RecipeDto>> GetRecipes([FromQuery] RecipeSearchParams @params)
        {
            var recipes = await _recipeRepo.GetRecipes();
            var filteredRecipes = _recipeService.FilterRecipes(recipes, @params);
            var data = _mapper.Map<IReadOnlyList<Recipe>, IReadOnlyList<RecipeDto>>(filteredRecipes);
            return data;
        }

        [HttpGet]
        [Route("overview")]
        public async Task<IReadOnlyList<RecipeDto>> GetRecipesOverview([FromQuery] RecipeSearchParams @params)
        {
            var recipes = await _recipeRepo.GetRecipesOverview();
            var filteredRecipes = _recipeService.FilterRecipes(recipes, @params);
            var data = _mapper.Map<IReadOnlyList<Recipe>, IReadOnlyList<RecipeDto>>(filteredRecipes);
            return data;
        }

        [HttpGet("tags")]
        public async Task<IReadOnlyList<TagDto>> GetTags()
        {
            var tags = await _recipeRepo.GetTags();
            var data = _mapper.Map<IReadOnlyList<Tag>, IReadOnlyList<TagDto>>(tags);

            return data;
        }

        [HttpGet("{id}")]
        public async Task<RecipeDto> GetRecipe(int id)
        {
            var recipe = await _recipeRepo.GetRecipe(id);
            var data = _mapper.Map<Recipe, RecipeDto>(recipe);

            return data;
        }

        [HttpPost]
        [Route("images")]
        public async Task<ActionResult<List<string>>> PostImages([FromForm] List<IFormFile> files)
        {
            try
            {
                var pictureUrls = await _fileService.SaveFiles(files, "images");
                return Ok(pictureUrls.Select(url => _config["ApiUrl"] + url));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [Route("user")]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<RecipeDto>>> GetUserRecipes()
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            var recipes = await GetRecipesOverview(new RecipeSearchParams { UserId = user.Id });

            return Ok(recipes);
        }

        [Authorize]
        [HttpPost]
        [Route("{id}/images")]
        public async Task<IActionResult> PostRecipeImages([FromRoute] int id, [FromForm] List<IFormFile> files)
        {
            try
            {
                var pictureUrls = await _fileService.SaveFiles(files, "images/recipes");
                var recipe = await _recipeRepo.GetRecipe(id);
                await _recipeService.AddImagesToRecipe(recipe, pictureUrls);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost]
        [Route("{id}/{stepId}/images")]
        public async Task<IActionResult> PostStepImages([FromRoute] int id, [FromRoute] int stepId, [FromForm] List<IFormFile> files)
        {
            try
            {
                var pictureUrls = await _fileService.SaveFiles(files, "images/recipes");
                var recipe = await _recipeRepo.GetRecipe(id);
                var step = recipe.Steps.FirstOrDefault(x => x.Id == stepId);
                await _recipeService.AddImagesToRecipeStep(step, pictureUrls);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostRecipe([FromBody] RecipeDto recipeDto)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            var recipe = _mapper.Map<RecipeDto, Recipe>(recipeDto);
            var savedRecipe = await _recipeService.AddRecipeAsync(recipe, user.Id);

            return Ok(savedRecipe.Id);
        }

        [Authorize]
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<int>> PutRecipe([FromRoute] int id, [FromBody] RecipeDto recipeDto)
        {
            var updatedRecipe = _mapper.Map<RecipeDto, Recipe>(recipeDto);
            var recipe = await _recipeRepo.GetRecipe(id);

            await _recipeService.UpdateRecipe(recipe, updatedRecipe);

            return Ok(recipe.Id);
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteRecipe([FromRoute] int id)
        {
            var recipe = await _recipeRepo.GetRecipe(id);
            await _recipeService.RemoveRecipe(recipe);

            return Ok();
        }

        [Authorize]
        [HttpPatch]
        [Route("{id}/rating/{rating}")]
        public async Task<IActionResult> PatchRating([FromRoute] int id, [FromRoute] double rating)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            var recipe = await _recipeRepo.GetRecipe(id);
            await _recipeService.UpdateRecipeRating(recipe, rating, user.Id);

            return Ok();
        }

        [Authorize]
        [HttpPatch]
        [Route("{id}/status")]
        public async Task<IActionResult> PatchStatus([FromRoute] int id, [FromBody] string status)
        {
            var recipe = await _recipeRepo.GetRecipe(id);
            bool success = await _recipeService.UpdateRecipeStatus(recipe, status);
            return Ok(success);
        }

        [HttpPost]
        [Route("ai-generated")]
        public async Task<ActionResult<RecipeDto>> GetAIGeneratedRecipe([FromBody] RecipeGeneratorRequest request)
        {
            bool isAuthRequired = _config.GetValue<bool>("Generator:RequireAuth");
            RecipeRequestHandlerResult result;
            if (isAuthRequired)
            {
                var user = await _userManager.Users
                    .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

                int tokenPrice = _config.GetValue<int>("Generator:TokenPrice");
                result = await _recipeRequestHandler.GenerateRecipeForUser(request, user, tokenPrice);
            }
            else
            {
                result = await _recipeRequestHandler.GenerateRecipe(request);
            }

            if (result.Status == ResponseStatus.Success)
                return Ok(result.Data);
            else
                return Unauthorized(new ApiResponse(401, result.Status.ToString()));
        }

        [Authorize]
        [HttpGet]
        [Route("backup-recipes")]
        public async Task<ActionResult> BackupRecipes()
        {
            var recipes = await _recipeRepo.GetRecipes();
            var recipesDtos = _mapper.Map<IReadOnlyList<Recipe>, IReadOnlyList<RecipeDto>>(recipes);
            var fileName = DateTime.UtcNow.ToString("MM-dd-yyyy HH-mm-ss") + ".json";
            await _fileService.BackupRecipes(recipesDtos, "backup/recipes", fileName);

            return Ok();
        }
    }
}
