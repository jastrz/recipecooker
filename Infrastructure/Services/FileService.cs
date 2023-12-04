using System.Text.Json;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Shared.Dtos;

namespace Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        private readonly string path;

        public FileService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            path = _webHostEnvironment.ContentRootPath;
        }

        public async Task<List<string>> SaveFiles(List<IFormFile> files, string relativePath)
        {
            if (files == null || files.Count == 0)
            {
                throw new Exception("No files send for upload.");
            }

            List<string> fileUrls = new();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var filePath = Path.Combine(path + @"/Content/" + @relativePath, file.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    fileUrls.Add(string.Format("{0}/{1}", relativePath, file.FileName));
                }
            }

            return fileUrls;
        }

        public async Task BackupRecipes(IReadOnlyList<RecipeDto> recipes, string relativePath, string fileName)
        {
            var json = JsonSerializer.Serialize(recipes,
                new JsonSerializerOptions
                {
                    WriteIndented = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

            var directoryPath = path + @"/Backup/" + @relativePath;

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var filePath = Path.Combine(directoryPath, fileName);
            await File.WriteAllTextAsync(filePath, json);
        }
    }
}