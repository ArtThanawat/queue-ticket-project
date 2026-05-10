using QueueTicketApi.Constants;

namespace QueueTicketApi.Models;

public sealed class QueueTicket
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public int QueueIndex { get; set; }

    public string QueueNumber { get; set; } = string.Empty;

    public string Status { get; set; } = QueueTicketStatus.Active;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
