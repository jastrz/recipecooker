using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data
{
    /// <inheritdoc />
    public partial class AddedUserIdToRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Rating",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Rating");
        }
    }
}
