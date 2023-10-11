using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Recipe, RecipeDto>()
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom(src => src.PictureUrls.Select(p => p.Url)))
                .ForMember(dest => dest.RecipeTags, opt => opt.MapFrom(src => src.RecipeTags.Select(rt => rt.Tag)));

            CreateMap<API.Dtos.RecipeDto, Recipe>()
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom(src => src.PictureUrls.Select(url => new Picture { Url = url })))
                .ForMember(dest => dest.RecipeTags, opt => opt.MapFrom(src => src.RecipeTags.Select(tag => new RecipeTag
                 { 
                    Tag = new Tag() 
                    {
                        Name = tag.Name,
                        Type = tag.Type
                    }
                })));

            CreateMap<Tag, TagDto>();

            // Used for seeding.
            CreateMap<Infrastructure.Dtos.RecipeDto, Recipe>()
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom(src => src.PictureUrls.Select(url => new Picture { Url = url })))
                .ForMember(dest => dest.RecipeTags, opt => opt.MapFrom(src => src.RecipeTags.Select(tag => new RecipeTag { Tag = tag })));
        }
    }
}