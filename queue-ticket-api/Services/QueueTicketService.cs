using Microsoft.EntityFrameworkCore;
using QueueTicketApi.Constants;
using QueueTicketApi.Dtos;
using QueueTicketApi.Helpers;
using QueueTicketApi.Models;
using QueueTicketApi.Repositories;

namespace QueueTicketApi.Services;

public sealed class QueueTicketService(IQueueTicketRepository repository) : IQueueTicketService
{
    private const int MaxConcurrencyRetryCount = 3;
    private static readonly SemaphoreSlim CreateTicketLock = new(1, 1);

    public async Task<QueueTicketDto> GetCurrentTicketAsync()
    {
        var ticket = await repository.GetLatestTicketAsync();

        if (ticket is not null)
        {
            return ToDto(ticket);
        }

        return CreateResetTicketDto();
    }

    public async Task<QueueTicketDto> CreateTicketAsync()
    {
        return await RunWithConcurrencyRetryAsync(CreateTicketOnceAsync);
    }

    public async Task<QueueTicketDto> ResetQueueAsync()
    {
        return await RunWithConcurrencyRetryAsync(ResetQueueOnceAsync);
    }

    public async Task<HealthCheckDto> CheckHealthAsync()
    {
        var canConnect = false;

        try
        {
            canConnect = await repository.CanConnectDatabaseAsync();
        }
        catch
        {
            canConnect = false;
        }

        return new HealthCheckDto
        {
            Api = HealthStatus.Ok,
            Database = canConnect ? HealthStatus.Connected : HealthStatus.Disconnected
        };
    }

    private async Task<QueueTicketDto> RunWithConcurrencyRetryAsync(
        Func<Task<QueueTicketDto>> action)
    {
        for (var attempt = 1; attempt <= MaxConcurrencyRetryCount; attempt++)
        {
            await CreateTicketLock.WaitAsync();

            try
            {
                return await action();
            }
            catch (DbUpdateConcurrencyException) when (attempt < MaxConcurrencyRetryCount)
            {
                repository.ClearChanges();
            }
            finally
            {
                CreateTicketLock.Release();
            }
        }

        throw new InvalidOperationException("Unable to update queue counter after retries.");
    }

    private async Task<QueueTicketDto> CreateTicketOnceAsync()
    {
        var counter = await GetOrCreateCounterAsync();
        var latestTicket = await repository.GetLatestTicketAsync();
        var nextIndex = latestTicket is null || latestTicket.Status == QueueTicketStatus.Reset
            ? 0
            : QueueNumberHelper.GetNextIndex(counter.CurrentIndex);

        counter.CurrentIndex = nextIndex;
        counter.UpdatedAt = DateTimeOffset.UtcNow;

        var ticket = CreateActiveTicket(nextIndex);

        await repository.AddTicketAsync(ticket);
        await repository.SaveChangesAsync();

        return ToDto(ticket);
    }

    private async Task<QueueTicketDto> ResetQueueOnceAsync()
    {
        var counter = await GetOrCreateCounterAsync();

        counter.CurrentIndex = QueueNumberHelper.ResetQueueIndex;
        counter.UpdatedAt = DateTimeOffset.UtcNow;

        var ticket = CreateResetTicket();

        await repository.AddTicketAsync(ticket);
        await repository.SaveChangesAsync();

        return ToDto(ticket);
    }

    private async Task<QueueCounter> GetOrCreateCounterAsync()
    {
        var counter = await repository.GetCounterAsync();

        if (counter is not null)
        {
            return counter;
        }

        counter = new QueueCounter
        {
            Id = QueueCounter.MainCounterId,
            CurrentIndex = QueueNumberHelper.ResetQueueIndex,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        await repository.AddCounterAsync(counter);

        return counter;
    }

    private static QueueTicket CreateActiveTicket(int queueIndex)
    {
        return new QueueTicket
        {
            QueueIndex = queueIndex,
            QueueNumber = QueueNumberHelper.FormatQueueNumber(queueIndex),
            Status = QueueTicketStatus.Active,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    private static QueueTicket CreateResetTicket()
    {
        return new QueueTicket
        {
            QueueIndex = QueueNumberHelper.ResetQueueIndex,
            QueueNumber = QueueNumberHelper.ResetQueueNumber,
            Status = QueueTicketStatus.Reset,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    private static QueueTicketDto CreateResetTicketDto()
    {
        return new QueueTicketDto
        {
            Id = Guid.Empty,
            QueueIndex = QueueNumberHelper.ResetQueueIndex,
            QueueNumber = QueueNumberHelper.ResetQueueNumber,
            Status = QueueTicketStatus.Reset,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    private static QueueTicketDto ToDto(QueueTicket ticket)
    {
        return new QueueTicketDto
        {
            Id = ticket.Id,
            QueueIndex = ticket.QueueIndex,
            QueueNumber = ticket.QueueNumber,
            Status = ticket.Status,
            CreatedAt = ticket.CreatedAt
        };
    }
}
