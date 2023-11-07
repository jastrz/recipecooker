using AutoMapper;
using Core.Interfaces;

namespace API.Helpers
{
    public class PictureUrlResolver : IValueResolver<IEntityWithPictures, object, List<string>>
    {
        private readonly IConfiguration _configuration;

        public PictureUrlResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<string> Resolve(IEntityWithPictures source, object destination, List<string> destMember, ResolutionContext context)
        {
            if (source.Pictures == null)
            {
                return new List<string>();
            }

            return source.Pictures
                .Where(picture => !string.IsNullOrEmpty(picture.Url))
                .Select(picture => _configuration["ApiUrl"] + picture.Url)
                .ToList();
        }
    }
}