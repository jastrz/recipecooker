using Microsoft.AspNetCore.Http;

namespace Infrastructure.Interfaces
{
    public interface IFileService
    {
        Task<List<string>> SaveFiles(List<IFormFile> files, string relativePath);
    }
}