using System.Security.Claims;
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

        public RecipesController(IRecipeRepository recipeRepo, IMapper mapper, ILogger<RecipesController> logger,
         IRecipeService recipeService, IFileService fileUploadService, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _fileService = fileUploadService;
            _recipeService = recipeService;
            _logger = logger;
            _recipeRepo = recipeRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IReadOnlyList<RecipeDto>> GetRecipes([FromQuery] RecipeTagParams @params)
        {
            var recipes = await _recipeRepo.GetRecipes();
            var filteredRecipes = _recipeService.FilterRecipes(recipes, @params);
            var data = _mapper.Map<IReadOnlyList<Recipe>, IReadOnlyList<RecipeDto>>(filteredRecipes);
            return data;
        }

        [HttpGet]
        [Route("overview")]
        public async Task<IReadOnlyList<RecipeDto>> GetRecipesOverview([FromQuery] RecipeTagParams @params)
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

        [HttpGet("steps/{id}")]
        public async Task<IReadOnlyList<RecipeStepDto>> GetRecipeSteps(int id)
        {
            var steps = await _recipeRepo.GetRecipeSteps(id);
            var data = _mapper.Map<IReadOnlyList<RecipeStep>, IReadOnlyList<RecipeStepDto>>(steps);

            return data;
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
            var recipe = _mapper.Map<RecipeDto, Recipe>(recipeDto);
            var savedRecipe = await _recipeService.AddRecipeAsync(recipe);

            return Ok(savedRecipe.Id);
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
    }
}
