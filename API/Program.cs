using Core.Interfaces;
using Infrastructure;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<CookerContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();
builder.Services.AddScoped<IRecipeService, RecipeService>();
builder.Services.AddScoped<CookerContextSeed>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

app.UseCors(builder => builder
    .WithOrigins("*")
    .AllowAnyMethod()
    .AllowAnyHeader()
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
//app.MapFallbackToController("Index", "Fallback");

app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}"
);

// app.MapFallbackToFile("index.html"); ;

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var cookerContext = services.GetRequiredService<CookerContext>();
var logger = services.GetRequiredService<ILogger<Program>>();

try 
{
    await cookerContext.Database.MigrateAsync();
    if(cookerContext.Recipes.Count() == 0)
    {
        var cookerContextSeed = services.GetRequiredService<CookerContextSeed>();
        await cookerContextSeed.SeedAsync(cookerContext);
    }
}
catch(Exception ex)
{
    logger.LogError(ex, "Error during migration.");
}

app.Run();
