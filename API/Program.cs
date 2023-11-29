using System.Diagnostics;
using System.Text;
using API.Errors;
using API.Extensions;
using API.MiddleWare;
using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure;
using Infrastructure.Identity;
using Infrastructure.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<CookerContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();
builder.Services.AddScoped<IRecipeService, RecipeService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IChatGPTService, ChatGPTService>();
builder.Services.AddScoped<IRecipeGeneratorService, RecipeGeneratorService>();
builder.Services.AddScoped<CookerContextSeed>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Flatten validation error response
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        var errors = actionContext.ModelState.Where(e => e.Value.Errors.Count > 0)
            .SelectMany(x => x.Value.Errors)
            .Select(x => x.ErrorMessage).ToArray();

        var errorResponse = new ApiValidationErrorResponse
        {
            Errors = errors
        };

        return new BadRequestObjectResult(errorResponse);
    };
});

// Identity
builder.Services.AddDbContext<AppIdentityDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection"));
});

builder.Services.AddIdentityCore<AppUser>(opt =>
{
    // add identity options here
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppIdentityDbContext>()
    .AddSignInManager<SignInManager<AppUser>>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Token:Key"])),
                        ValidIssuer = builder.Configuration["Token:Issuer"],
                        ValidateIssuer = true,
                        ValidateAudience = false
                    };
                });
// .AddGoogle("google", options =>
// {
//     var googleAuthConfig = builder.Configuration.GetSection("GoogleAuthentication");
//     options.ClientId = googleAuthConfig["ClientId"];
//     options.ClientSecret = googleAuthConfig["ClientSecret"];
//     options.SignInScheme = IdentityConstants.ExternalScheme;
//     options.CallbackPath = ""
// });

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
// app.MapFallbackToController("Index", "Fallback");

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

await RemoveNonExistentTags();

app.Run();

async Task RemoveNonExistentTags()
{

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var cookerContext = services.GetRequiredService<CookerContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogWarning("Removing nonexistent tags.");

        var recipes = cookerContext.Recipes;
        var allTagsInRecipes = recipes
                .Include(r => r.RecipeTags)
                    .ThenInclude(r => r.Tag)
            .SelectMany(x => x.RecipeTags)
            .Select(y => y.Tag.Name).Distinct().ToList();

        var recipeTags = cookerContext.RecipeTag
            .Include(t => t.Tag).ToList();

        for (int i = recipeTags.Count() - 1; i >= 0; i--)
        {
            if (!allTagsInRecipes.Contains(recipeTags[i].Tag.Name))
            {
                logger.LogError(recipeTags[i].Tag.Name);
                cookerContext.Tags.Remove(recipeTags[i].Tag);
            }
        }

        var tags = cookerContext.Tags.ToList();

        for (int i = tags.Count() - 1; i >= 0; i--)
        {
            if (!allTagsInRecipes.Contains(tags[i].Name))
            {
                cookerContext.Remove(tags[i]);
            }
        }

        await cookerContext.SaveChangesAsync();
    }
}