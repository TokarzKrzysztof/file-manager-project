using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addparamcolumnhistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Param",
                table: "History",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Param",
                table: "History");
        }
    }
}
