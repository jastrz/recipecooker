using Microsoft.AspNetCore.Http;

namespace Infrastructure.Interfaces
{
    public interface IFileUploadService
    {
        Task<List<string>> UploadFiles(List<IFormFile> files, string relativePath);
    }
}