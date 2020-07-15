using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class updatefilemodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "PropertyName",
                table: "Files");

            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "Files",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Files",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "Files",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "Files",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<DateTime>(
                name: "UploadTime",
                table: "Files",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "UploadTime",
                table: "Files");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Files",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropertyName",
                table: "Files",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
