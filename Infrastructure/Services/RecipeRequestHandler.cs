using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Shared.Dtos;
using Shared.Enums;

namespace Infrastructure.Services
{
    public class RecipeRequestHandler : IRecipeRequestHandler
    {
        private readonly IUserService _userService;
        private readonly IRecipeGeneratorService _recipeGenerator;
        private readonly IRecipeService _recipeService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public RecipeRequestHandler(IUserService userService, IRecipeGeneratorService recipeGeneratorService,
            IRecipeService recipeService, IMapper mapper, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _recipeService = recipeService;
            _recipeGenerator = recipeGeneratorService;
            _userService = userService;
        }

        public async Task<RecipeRequestHandlerResult> GenerateRecipeForUser(RecipeGeneratorRequest? request, AppUser user, int tokenPrice)
        {
            if (user == null) return new RecipeRequestHandlerResult { Status = ResponseStatus.Unauthorized };
            var userRoles = await _userManager.GetRolesAsync(user);
            if (tokenPrice > 0 && !userRoles.Contains("Administrator"))
            {
                if (user.TokenCount >= tokenPrice)
                {
                    await _userService.UpdateTokenCount(user, -tokenPrice);
                    var result = await GenerateRecipe(request, user.Id);
                    return result;
                }
                else return new RecipeRequestHandlerResult { Status = ResponseStatus.InsufficentTokens };
            }
            else
            {
                return await GenerateRecipe(request, user.Id);
            }
        }

        public async Task<RecipeRequestHandlerResult> GenerateRecipe(RecipeGeneratorRequest? request, string userId = null)
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
            var addedRecipe = await _recipeService.AddRecipeAsync(recipeToAdd, userId);
            var recipeDto = _mapper.Map<Recipe, RecipeDto>(addedRecipe);

            result.Status = ResponseStatus.Success;
            result.Data = recipeDto;

            return result;
        }
    }
}