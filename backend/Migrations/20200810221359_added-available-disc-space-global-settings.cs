using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addedavailablediscspaceglobalsettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "TotalDiscSpace",
                table: "GlobalSettings",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.UpdateData(
                table: "GlobalSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "TotalDiscSpace",
                value: 2147483648L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalDiscSpace",
                table: "GlobalSettings");
        }
    }
}
