using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileUploadService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<List<string>> UploadFiles(List<IFormFile> files, string relativePath)
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
                    var path = _webHostEnvironment.ContentRootPath;
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
    }
}