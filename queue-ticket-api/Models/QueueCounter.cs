namespace QueueTicketApi.Models;

public sealed class QueueCounter
{
    public const int MainCounterId = 1;

    public int Id { get; set; }

    public int CurrentIndex { get; set; }

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public byte[] RowVersion { get; set; } = [];
}
