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
                .ForMember(dest => dest.RecipeTags, opt => opt.MapFrom(src => src.RecipeTags.Select(rt => rt.Tag)))
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom<RecipeUrlResolver>());

            CreateMap<API.Dtos.RecipeDto, Recipe>()
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom(src => src.PictureUrls.Select(url => new Picture { Url = url })))
                .ForMember(dest => dest.RecipeTags, opt => opt.MapFrom(src => src.RecipeTags.Select(tag => new RecipeTag
                 { 
                    Tag = new Tag() 
                    {
                        Name = tag.Name,
                        Category = new() 
                        {
                            Name = tag.Category
                        }
                    }
                })));

            CreateMap<Tag, TagDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name));

            // Used for seeding.
            CreateMap<Infrastructure.Dtos.RecipeDto, Recipe>()
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom(src => src.PictureUrls.Select(url => new Picture { Url = url })))
                .ForMember(dest => dest.RecipeTags, opt => opt.MapFrom(src => src.RecipeTags.Select(tag => new RecipeTag 
                { 
                    Tag = new Tag() 
                    {
                        Name = tag.Name,
                        Category = new() 
                        {
                            Name = tag.Category
                        }
                    }
                })));

            CreateMap<RecipeStep, RecipeStepDto>();
        }
    }
}