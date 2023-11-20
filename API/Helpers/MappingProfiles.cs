using AutoMapper;
using Core.Entities;
using Shared.Dtos;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Recipe, RecipeDto>()
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.RecipeTags.Select(rt => rt.Tag)))
                .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.RecipeIngredients))
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom<PictureUrlResolver>())
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.GetRating()));

            CreateMap<RecipeDto, Recipe>()
                .ForMember(dest => dest.Pictures, opt => opt.MapFrom(src => src.PictureUrls.Select(url => new Picture { Url = url })))
                .ForMember(dest => dest.RecipeTags, opt => opt.MapFrom(src => src.Tags.Select(tag => new RecipeTag
                {
                    Tag = new Tag()
                    {
                        Name = tag.Name,
                        Category = new()
                        {
                            Name = tag.Category
                        }
                    }
                })))
                .ForMember(dest => dest.RecipeIngredients, opt => opt.MapFrom(src => src.Ingredients.Select(ingredient => new RecipeIngredient
                {
                    Ingredient = new Ingredient()
                    {
                        Name = ingredient.Name,
                        Unit = ingredient.Unit
                    },
                    Quantity = ingredient.Quantity
                })));

            CreateMap<Tag, TagDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<RecipeStep, RecipeStepDto>()
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom<PictureUrlResolver>());

            CreateMap<RecipeStepDto, RecipeStep>()
                .ForMember(dest => dest.Pictures, opt => opt.MapFrom(src => src.PictureUrls.Select(url => new Picture { Url = url })));

            CreateMap<RecipeIngredient, IngredientDto>()
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Ingredient.Name))
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Ingredient.Unit));
        }
    }
}