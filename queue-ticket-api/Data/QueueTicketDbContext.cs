using Microsoft.EntityFrameworkCore;
using QueueTicketApi.Models;

namespace QueueTicketApi.Data;

public sealed class QueueTicketDbContext(DbContextOptions<QueueTicketDbContext> options)
    : DbContext(options)
{
    public DbSet<QueueTicket> QueueTickets => Set<QueueTicket>();

    public DbSet<QueueCounter> QueueCounters => Set<QueueCounter>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<QueueTicket>(entity =>
        {
            entity.HasKey(ticket => ticket.Id);
            entity.Property(ticket => ticket.QueueNumber).HasMaxLength(2).IsRequired();
            entity.Property(ticket => ticket.Status).HasMaxLength(20).IsRequired();
            entity.Property(ticket => ticket.CreatedAt).HasDefaultValueSql("SYSDATETIMEOFFSET()");
        });

        modelBuilder.Entity<QueueCounter>(entity =>
        {
            entity.HasKey(counter => counter.Id);
            entity.Property(counter => counter.Id).ValueGeneratedNever();
            entity.Property(counter => counter.RowVersion).IsRowVersion();
        });
    }
}
