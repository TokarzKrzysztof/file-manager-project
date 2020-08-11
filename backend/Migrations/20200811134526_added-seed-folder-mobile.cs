using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addedseedfoldermobile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Folders",
                columns: new[] { "Id", "IsActive", "Name", "ParentId" },
                values: new object[] { 1, true, "Mobile", null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Folders",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
