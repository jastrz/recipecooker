using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data
{
    /// <inheritdoc />
    public partial class AddedRecipeStepPictures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RecipeStepRecipeId",
                table: "Picture",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecipeStepSequence",
                table: "Picture",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Picture_RecipeStepRecipeId_RecipeStepSequence",
                table: "Picture",
                columns: new[] { "RecipeStepRecipeId", "RecipeStepSequence" });

            migrationBuilder.AddForeignKey(
                name: "FK_Picture_Steps_RecipeStepRecipeId_RecipeStepSequence",
                table: "Picture",
                columns: new[] { "RecipeStepRecipeId", "RecipeStepSequence" },
                principalTable: "Steps",
                principalColumns: new[] { "RecipeId", "Sequence" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Picture_Steps_RecipeStepRecipeId_RecipeStepSequence",
                table: "Picture");

            migrationBuilder.DropIndex(
                name: "IX_Picture_RecipeStepRecipeId_RecipeStepSequence",
                table: "Picture");

            migrationBuilder.DropColumn(
                name: "RecipeStepRecipeId",
                table: "Picture");

            migrationBuilder.DropColumn(
                name: "RecipeStepSequence",
                table: "Picture");
        }
    }
}
