using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace intex_app.API.Migrations
{
    /// <inheritdoc />
    public partial class v5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Headlines",
                columns: table => new
                {
                    HeadlineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Headlines", x => x.HeadlineId);
                });

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    ShowId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Director = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cast = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReleaseYear = table.Column<int>(type: "int", nullable: true),
                    Rating = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Duration = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.ShowId);
                });

            migrationBuilder.CreateTable(
                name: "MovieUsers",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Age = table.Column<int>(type: "int", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Zip = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieUsers", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "SiteTraffic",
                columns: table => new
                {
                    TrafficId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fingerprint = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteTraffic", x => x.TrafficId);
                });

            migrationBuilder.CreateTable(
                name: "StreamingServices",
                columns: table => new
                {
                    StreamingServiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StreamingServices", x => x.StreamingServiceId);
                });

            migrationBuilder.CreateTable(
                name: "MovieCategories",
                columns: table => new
                {
                    ShowId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieCategories", x => new { x.ShowId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_MovieCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieCategories_Movies_ShowId",
                        column: x => x.ShowId,
                        principalTable: "Movies",
                        principalColumn: "ShowId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MovieUserStreamingServices",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    StreamingServiceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieUserStreamingServices", x => new { x.UserId, x.StreamingServiceId });
                    table.ForeignKey(
                        name: "FK_MovieUserStreamingServices_MovieUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "MovieUsers",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieUserStreamingServices_StreamingServices_StreamingServiceId",
                        column: x => x.StreamingServiceId,
                        principalTable: "StreamingServices",
                        principalColumn: "StreamingServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "StreamingServices",
                columns: new[] { "StreamingServiceId", "Name" },
                values: new object[,]
                {
                    { 1, "Netflix" },
                    { 2, "Amazon Prime" },
                    { 3, "Disney+" },
                    { 4, "Hulu" },
                    { 5, "Max" },
                    { 6, "Apple TV+" },
                    { 7, "Peacock" },
                    { 8, "Paramount+" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovieCategories_CategoryId",
                table: "MovieCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieUserStreamingServices_StreamingServiceId",
                table: "MovieUserStreamingServices",
                column: "StreamingServiceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Headlines");

            migrationBuilder.DropTable(
                name: "MovieCategories");

            migrationBuilder.DropTable(
                name: "MovieUserStreamingServices");

            migrationBuilder.DropTable(
                name: "SiteTraffic");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Movies");

            migrationBuilder.DropTable(
                name: "MovieUsers");

            migrationBuilder.DropTable(
                name: "StreamingServices");
        }
    }
}
