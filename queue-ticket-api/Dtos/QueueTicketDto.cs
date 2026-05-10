namespace QueueTicketApi.Dtos;

public sealed class QueueTicketDto
{
    public Guid Id { get; set; }

    public int QueueIndex { get; set; }

    public string QueueNumber { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; }
}
