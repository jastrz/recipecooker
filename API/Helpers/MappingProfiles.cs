using API.Dtos;
using AutoMapper;
using Core.Entities;
using Infrastructure.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Recipe, API.Dtos.RecipeDto>()
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom(src => src.PictureUrls.Select(p => p.Url)))
                .ForMember(dest => dest.RecipeTags, opt => opt.MapFrom(src => src.RecipeTags.Select(rt => rt.Tag)))
                .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.RecipeIngredients))
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
                })))
                .ForMember(dest => dest.RecipeIngredients, opt => opt.MapFrom(src => src.Ingredients.Select(ingredient => new RecipeIngredient{
                    Ingredient = new Ingredient() {
                        Name = ingredient.Name,
                        Unit = ingredient.Unit
                    },
                    Quantity = ingredient.Quantity
                })));

            CreateMap<Tag, API.Dtos.TagDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name));

            // Used for seeding.
            CreateMap<Infrastructure.Dtos.RecipeDto, Recipe>()
                .ForMember(dest => dest.PictureUrls, opt => opt.MapFrom(src => src.PictureUrls.Select(url => new Picture { Url = url })))
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
                .ForMember(dest => dest.RecipeIngredients, opt => opt.MapFrom(src => src.Ingredients.Select(ingredient => new RecipeIngredient{
                    Ingredient = new Ingredient() {
                        Name = ingredient.Name,
                        Unit = ingredient.Unit
                    },
                    Quantity = ingredient.Quantity
                })));

            CreateMap<RecipeStep, RecipeStepDto>();
            CreateMap<RecipeIngredient, IngredientDto>()
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Ingredient.Name))
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Ingredient.Unit));
        }
    }
}