using System.Text.Json;
using System.Text.Json.Serialization;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public RecipesController(IRecipeRepository recipeRepo, IMapper mapper, ILogger<RecipesController> logger,
         IRecipeService recipeService, IFileService fileUploadService)
        {
            _fileService = fileUploadService;
            _recipeService = recipeService;
            _logger = logger;
            _recipeRepo = recipeRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IReadOnlyList<RecipeDto>> GetRecipes([FromQuery]RecipeSpecParams @params)
        {
            var recipes = await _recipeRepo.GetRecipes();

            if(!string.IsNullOrEmpty(@params.Character))
                recipes = recipes.Where(recipe => recipe.RecipeTags.Any(rt => rt.Tag.Name == @params.Character)).ToList();
            if(!string.IsNullOrEmpty(@params.MainIngredient))
                recipes = recipes.Where(recipe => recipe.RecipeTags.Any(rt => rt.Tag.Name == @params.MainIngredient)).ToList();
            if(!string.IsNullOrEmpty(@params.Origin))
                recipes = recipes.Where(recipe => recipe.RecipeTags.Any(rt => rt.Tag.Name == @params.Origin)).ToList();

            var data = _mapper.Map<IReadOnlyList<Recipe>, IReadOnlyList<RecipeDto>>(recipes);

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
        [Route("post/image")]
        public async Task<IActionResult> PostRecipeImagesAsync([FromForm] List<IFormFile> files) 
        {
            try
            {
                var pictureUrls = await _fileService.SaveFiles(files, "images/recipes");
                return Ok(pictureUrls);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost]
        [Route("post/step-images")]
        public async Task<IActionResult> PostStepImagesAsync([FromForm] List<IFormFile> files) 
        {
            try
            {
                var pictureUrls = await _fileService.SaveFiles(files, "images/steps");
                return Ok(pictureUrls);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost]
        [Route("post")]
        public async Task<IActionResult> PostRecipe([FromBody] RecipeDto recipeDto)
        {
            var recipe = _mapper.Map<RecipeDto, Recipe>(recipeDto);
            var savedRecipe = await _recipeService.AddRecipeAsync(recipe);

            return Ok(savedRecipe.Id);
        }
    }
}
