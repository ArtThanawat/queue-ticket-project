using QueueTicketApi.Models;

namespace QueueTicketApi.Repositories;

public interface IQueueTicketRepository
{
    Task<QueueCounter?> GetCounterAsync();

    Task<QueueTicket?> GetLatestTicketAsync();

    Task AddCounterAsync(QueueCounter counter);

    Task AddTicketAsync(QueueTicket ticket);

    Task SaveChangesAsync();

    void ClearChanges();

    Task<bool> CanConnectDatabaseAsync();
}
