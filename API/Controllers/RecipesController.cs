using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RecipesController : BaseApiController
    {
        private readonly IRecipeRepository _recipeRepo;
        private readonly IMapper _mapper;

        public RecipesController(IRecipeRepository recipeRepo, IMapper mapper)
        {
            _recipeRepo = recipeRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IReadOnlyList<RecipeDto>> GetRecipes()
        {
            var recipes = await _recipeRepo.GetRecipes();
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
    }
}