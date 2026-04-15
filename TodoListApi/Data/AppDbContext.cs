using Microsoft.EntityFrameworkCore;
using TodoListApi.Models;

namespace TodoListApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TodoTask> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TodoTask>()
                .Property(t => t.ExternalId)
                .ValueGeneratedNever();
        }
    }

}