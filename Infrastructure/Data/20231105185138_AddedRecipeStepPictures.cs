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
            migrationBuilder.RenameColumn(
                name: "Sequence",
                table: "Steps",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "RecipeStepId",
                table: "Picture",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecipeStepRecipeId",
                table: "Picture",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Picture_RecipeStepRecipeId_RecipeStepId",
                table: "Picture",
                columns: new[] { "RecipeStepRecipeId", "RecipeStepId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Picture_Steps_RecipeStepRecipeId_RecipeStepId",
                table: "Picture",
                columns: new[] { "RecipeStepRecipeId", "RecipeStepId" },
                principalTable: "Steps",
                principalColumns: new[] { "RecipeId", "Id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Picture_Steps_RecipeStepRecipeId_RecipeStepId",
                table: "Picture");

            migrationBuilder.DropIndex(
                name: "IX_Picture_RecipeStepRecipeId_RecipeStepId",
                table: "Picture");

            migrationBuilder.DropColumn(
                name: "RecipeStepId",
                table: "Picture");

            migrationBuilder.DropColumn(
                name: "RecipeStepRecipeId",
                table: "Picture");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Steps",
                newName: "Sequence");
        }
    }
}
