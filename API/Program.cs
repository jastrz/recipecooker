using API.Extensions;
using API.Helpers;
using API.MiddleWare;
using Core.Entities.Identity;
using Infrastructure;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddAppServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

app.UseCors(builder => builder
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowAnyOrigin()
);

app.UseMiddleware<ExceptionMiddleware>();
app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseSwaggerDocumentation();

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Content")),
    RequestPath = "/Content"
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var cookerContext = services.GetRequiredService<CookerContext>();
    var identityContext = services.GetRequiredService<AppIdentityDbContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();

    var logger = services.GetRequiredService<ILogger<Program>>();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roles = new[] { "Administrator", "SuperUser", "User" };

    try
    {
        await cookerContext.Database.MigrateAsync();
        if (cookerContext.Recipes.Count() == 0)
        {
            var cookerContextSeed = services.GetRequiredService<CookerContextSeed>();
            await cookerContextSeed.SeedAsync(cookerContext);
        }

        await identityContext.Database.MigrateAsync();
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }
        await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error during migration.");
    }
}

using (var scope = app.Services.CreateScope())
{
    await Utils.RemoveNonExistentTags(scope);
}

app.Run();