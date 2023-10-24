using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RecipesController : BaseApiController
    {
        private readonly IRecipeRepository _recipeRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<RecipesController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IRecipeService _recipeService;

        public RecipesController(IRecipeRepository recipeRepo, IMapper mapper, ILogger<RecipesController> logger, 
        IWebHostEnvironment webHostEnvironment, IRecipeService recipeService)
        {
            _recipeService = recipeService;
            _webHostEnvironment = webHostEnvironment;
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
        public async Task<IReadOnlyList<RecipeStepDto>> GetRecipeSteps(int id)
        {
            var steps = await _recipeRepo.GetRecipeSteps(id);
            var data = _mapper.Map<IReadOnlyList<RecipeStep>, IReadOnlyList<RecipeStepDto>>(steps);

            return data;
        }

        [HttpPost]
        [Route("post/image")]
        public async Task<IActionResult> PostRecipeImagesAsync([FromForm] List<IFormFile> files) 
        {
            try
            {
                var pictureUrls = new List<string>();
                if (files == null || files.Count == 0)
                {
                    return BadRequest("No files were sent for upload.");
                }

                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        var path = _webHostEnvironment.ContentRootPath;
                        var filePath = Path.Combine(path + @"/Content/images/recipes", file.FileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        pictureUrls.Add(string.Format("images/recipes/{0}", file.FileName));
                    }
                }

                return Ok(pictureUrls);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("post")]
        public async Task<IActionResult> PostRecipe([FromBody] RecipePostRequest request)
        {
            var recipe = _mapper.Map<RecipeDto, Recipe>(request.Recipe);
            await _recipeService.AddRecipeAsync(recipe, request.RecipeSteps);

            return Ok();
        }
    }
}
