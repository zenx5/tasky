using Microsoft.EntityFrameworkCore;
using TodoListApi.Data;
using TodoListApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Agrega soporte para Controladores
builder.Services.AddControllers();

// 2. Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Todo API V1");
    c.RoutePrefix = "swagger"; // Esto hace que cargue en http://localhost:5170/swagger
});

app.UseCors("AllowAll");

// app.UseHttpsRedirection();

// 4. Mapear los controladores (esto activa tu TasksController)
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    // Asegura que la base de datos esté creada (útil para el reclutador)
    context.Database.EnsureCreated();

    if (!context.Tasks.Any())
    {
        context.Tasks.AddRange(
            new TodoTask
            {
                ExternalId = Guid.NewGuid(),
                Description = "Learn ASP.NET Core basics",
                CreatedAt = DateTime.UtcNow,
                Order = 1
            },
            new TodoTask
            {
                ExternalId = Guid.NewGuid(),
                Description = "Build Vue.js frontend",
                CreatedAt = DateTime.UtcNow,
                Order = 2
            },
            new TodoTask
            {
                ExternalId = Guid.NewGuid(),
                Description = "Setup SQLite database",
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                CompletedAt = DateTime.UtcNow,
                Order = 3
            }
        );
        context.SaveChanges();
    }
}

app.Run();