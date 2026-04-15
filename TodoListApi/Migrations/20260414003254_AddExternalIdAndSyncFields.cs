using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoListApi.Migrations
{
    /// <inheritdoc />
    public partial class AddExternalIdAndSyncFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ExternalId",
                table: "Tasks",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Tasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Tasks",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Tasks");
        }
    }
}
