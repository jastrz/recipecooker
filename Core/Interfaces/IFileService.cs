using Microsoft.AspNetCore.Http;
using Shared.Dtos;

namespace Infrastructure.Interfaces
{
    public interface IFileService
    {
        Task<List<string>> SaveFiles(List<IFormFile> files, string relativePath);
        Task BackupRecipes(IReadOnlyList<RecipeDto> recipes, string relativePath, string fileName);
    }
}