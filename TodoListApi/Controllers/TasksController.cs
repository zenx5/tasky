using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoListApi.Data;
using TodoListApi.Models;

namespace TodoListApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/Tasks (Listar todas)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTask>>> GetTasks()
        {
            return await _context.Tasks.OrderByDescending(t => t.Order).ToListAsync();
        }

        // POST: api/v1/Tasks (Crear)
        [HttpPost]
        public async Task<ActionResult<TodoTask>> PostTask(TodoTask task)
        {
            if (task.ExternalId == Guid.Empty) task.ExternalId = Guid.NewGuid();

            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }

        // PUT: api/v1/Tasks/5 (Actualizar/Concluir)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, TodoTask task)
        {
            if (id != task.Id) return BadRequest();

            var existingTask = await _context.Tasks.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
            if (existingTask == null) return NotFound();

            if (task.UpdatedAt < existingTask.UpdatedAt)
            {
                return Conflict(new { message = "La versión del servidor es más reciente.", currentData = existingTask });
            }

            task.UpdatedAt = DateTime.UtcNow;
            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tasks.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/v1/Tasks/5 (Opcional, pero recomendado)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/v1/Tasks/sync (Sync)
        [HttpPost("sync")]
        public async Task<IActionResult> SyncTasks([FromBody] List<TodoTask> tasks)
        {
            foreach (var task in tasks)
            {
                var dbTask = await _context.Tasks.FirstOrDefaultAsync(t => t.ExternalId == task.ExternalId);
                if (dbTask == null) {
                    _context.Tasks.Add(task);
                } else if (task.UpdatedAt > dbTask.UpdatedAt) {
                    dbTask.Description = task.Description;
                    dbTask.CompletedAt = task.CompletedAt;
                    dbTask.UpdatedAt = DateTime.UtcNow;
                }
            }
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}