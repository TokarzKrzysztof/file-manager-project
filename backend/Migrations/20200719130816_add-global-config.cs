using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addglobalconfig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GlobalSettings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaxSize = table.Column<int>(nullable: false),
                    LimitPerHour = table.Column<int>(nullable: false),
                    MinLength = table.Column<int>(nullable: false),
                    MinDigits = table.Column<int>(nullable: false),
                    BigLetters = table.Column<int>(nullable: false),
                    SpecialCharacters = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GlobalSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "GlobalSettings",
                columns: new[] { "Id", "BigLetters", "LimitPerHour", "MaxSize", "MinDigits", "MinLength", "SpecialCharacters" },
                values: new object[] { 1, 0, 20, 1000, 0, 0, 0 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GlobalSettings");
        }
    }
}
