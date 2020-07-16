using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addedtitleandorderfiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Files",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Files",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Files");
        }
    }
}
