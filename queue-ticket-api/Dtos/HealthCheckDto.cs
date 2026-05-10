namespace QueueTicketApi.Dtos;

public sealed class HealthCheckDto
{
    public string Api { get; set; } = string.Empty;

    public string Database { get; set; } = string.Empty;
}
