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
    }
}