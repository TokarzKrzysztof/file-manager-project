using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addsystemaccesscolumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SystemAccess",
                table: "Users",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SystemAccess",
                table: "Users");
        }
    }
}
