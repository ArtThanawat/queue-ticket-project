using QueueTicketApi.Dtos;

namespace QueueTicketApi.Services;

public interface IQueueTicketService
{
    Task<QueueTicketDto> GetCurrentTicketAsync();

    Task<QueueTicketDto> CreateTicketAsync();

    Task<QueueTicketDto> ResetQueueAsync();

    Task<HealthCheckDto> CheckHealthAsync();
}
