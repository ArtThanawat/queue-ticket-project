using Microsoft.EntityFrameworkCore;
using QueueTicketApi.Data;
using QueueTicketApi.Models;

namespace QueueTicketApi.Repositories;

public sealed class QueueTicketRepository(QueueTicketDbContext dbContext) : IQueueTicketRepository
{
    public Task<QueueCounter?> GetCounterAsync()
    {
        return dbContext.QueueCounters
            .FirstOrDefaultAsync(counter => counter.Id == QueueCounter.MainCounterId);
    }

    public Task<QueueTicket?> GetLatestTicketAsync()
    {
        return dbContext.QueueTickets
            .OrderByDescending(ticket => ticket.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task AddCounterAsync(QueueCounter counter)
    {
        await dbContext.QueueCounters.AddAsync(counter);
    }

    public async Task AddTicketAsync(QueueTicket ticket)
    {
        await dbContext.QueueTickets.AddAsync(ticket);
    }

    public async Task SaveChangesAsync()
    {
        await dbContext.SaveChangesAsync();
    }

    public void ClearChanges()
    {
        dbContext.ChangeTracker.Clear();
    }

    public Task<bool> CanConnectDatabaseAsync()
    {
        return dbContext.Database.CanConnectAsync();
    }
}
