using Microsoft.EntityFrameworkCore;
using Core.Entities;
using System.Reflection;

namespace Infrastructure
{
    public class CookerContext : DbContext
    {
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<RecipeStep> Steps { get; set; }

        public CookerContext(DbContextOptions<CookerContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                foreach (var entityType in modelBuilder.Model.GetEntityTypes())
                {
                    var properties = entityType.ClrType.GetProperties()
                        .Where(p => p.PropertyType == typeof(decimal));

                    foreach (var property in properties)
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name)
                            .HasConversion<double>();
                    }
                }
            }

            modelBuilder.Entity<RecipeTag>()
                .HasKey(rt => new { rt.RecipeId, rt.TagId });

            modelBuilder.Entity<RecipeTag>()
                .HasOne(rt => rt.Recipe)
                .WithMany(r => r.Tags)
                .HasForeignKey(rt => rt.RecipeId);

            modelBuilder.Entity<RecipeTag>()
                .HasOne(rt => rt.Tag)
                .WithMany(t => t.RecipeTags)
                .HasForeignKey(rt => rt.TagId);

            modelBuilder.Entity<RecipeStep>()
                .HasKey(rs => new { rs.RecipeId, rs.Sequence });
        }
    }
}