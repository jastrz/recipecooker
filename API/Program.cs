using API.Extensions;
using API.MiddleWare;
using Microsoft.Extensions.FileProviders;
using static API.Helpers.InitializationUtils;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddAppServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseSwaggerDocumentation();

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Content")),
    RequestPath = "/Content"
});

app.UseCors(builder => builder
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowAnyOrigin()
);

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UsePathBase("/a-reci-qkr");
app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

await app.Initialize();

app.Run();