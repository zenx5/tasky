namespace TodoListApi.Models
{
    public class TodoTask
    {
        public int Id { get; set; }
        public Guid ExternalId { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public int Order { get; set; }
    }
}