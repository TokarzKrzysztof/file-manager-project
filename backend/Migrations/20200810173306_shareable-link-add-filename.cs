using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class shareablelinkaddfilename : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "ShareableLinks");

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "ShareableLinks",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                table: "ShareableLinks");

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "ShareableLinks",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
