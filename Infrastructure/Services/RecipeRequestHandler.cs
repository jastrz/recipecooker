using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Shared.Dtos;

namespace Infrastructure.Services
{
    public class RecipeRequestHandler : IRecipeRequestHandler
    {
        private readonly IUserService _userService;
        private readonly IRecipeGeneratorService _recipeGenerator;
        private readonly IRecipeService _recipeService;
        private readonly IMapper _mapper;

        public RecipeRequestHandler(IUserService userService, IRecipeGeneratorService recipeGeneratorService,
            IRecipeService recipeService, IMapper mapper)
        {
            _mapper = mapper;
            _recipeService = recipeService;
            _recipeGenerator = recipeGeneratorService;
            _userService = userService;
        }

        public async Task<RecipeRequestHandlerResult> GenerateRecipeForUser(RecipeGeneratorRequest? request, AppUser user, int tokenPrice)
        {
            if (user == null) return new RecipeRequestHandlerResult { Status = ResponseStatus.Unauthorized };
            if (tokenPrice > 0)
            {
                if (user.TokenCount >= tokenPrice)
                {
                    await _userService.UpdateTokenCount(user, -tokenPrice);
                    return await GenerateRecipe(request);
                }
                else return new RecipeRequestHandlerResult { Status = ResponseStatus.InsufficentTokens };
            }
            else
            {
                return await GenerateRecipe(request);
            }
        }

        public async Task<RecipeRequestHandlerResult> GenerateRecipe(RecipeGeneratorRequest? request)
        {
            RecipeRequestHandlerResult result = new();

            RecipeDto recipe;
            if (request.Description != null)
            {
                recipe = await _recipeGenerator.GenerateRecipeFromRequest(request);
            }
            else
            {
                recipe = await _recipeGenerator.GetRandomRecipe();
            }

            // Temporarily adding generated recipes to db
            // TODO: store them in e.g. redis
            var recipeToAdd = _mapper.Map<RecipeDto, Recipe>(recipe);
            var addedRecipe = await _recipeService.AddRecipeAsync(recipeToAdd);
            var recipeDto = _mapper.Map<Recipe, RecipeDto>(addedRecipe);

            result.Status = ResponseStatus.Success;
            result.Data = recipeDto;

            return result;
        }
    }
}