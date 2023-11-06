using AutoMapper;
using Core.Entities;
using Shared.Dtos;

namespace API.Helpers
{
    public class RecipeUrlResolver : IValueResolver<Recipe, RecipeDto, List<string>>
    {
        private readonly IConfiguration _configuration;
        public RecipeUrlResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<string> Resolve(Recipe source, RecipeDto destination, List<string> destMember, ResolutionContext context)
        {
            List<string> urls = new List<string>();

            foreach (var picture in source.PictureUrls)
            {
                if (!string.IsNullOrEmpty(picture.Url))
                {
                    urls.Add(_configuration["ApiUrl"] + picture.Url);
                }
            }

            return urls;
        }
    }

    public class RecipeStepValueResolver : IValueResolver<RecipeStep, RecipeStepDto, List<string>>
    {
        private readonly IConfiguration _configuration;
        public RecipeStepValueResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<string> Resolve(RecipeStep source, RecipeStepDto destination, List<string> destMember, ResolutionContext context)
        {
            List<string> urls = new List<string>();

            foreach (var picture in source.PictureUrls)
            {
                if (!string.IsNullOrEmpty(picture.Url))
                {
                    urls.Add(_configuration["ApiUrl"] + picture.Url);
                }
            }

            return urls;
        }
    }
}