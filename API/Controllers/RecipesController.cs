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

            var groupedData = data.GroupBy(tag => tag.Type)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(tag => tag.Name).ToList()
                );

            return data;
        }
    }
}