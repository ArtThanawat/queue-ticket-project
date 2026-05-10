using Microsoft.EntityFrameworkCore;
using QueueTicketApi.Data;
using QueueTicketApi.Helpers;
using QueueTicketApi.Middleware;
using QueueTicketApi.Models;
using QueueTicketApi.Repositories;
using QueueTicketApi.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is missing.");

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>() ?? [];

    options.AddPolicy("LocalWebApp", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<QueueTicketDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

builder.Services.AddScoped<IQueueTicketRepository, QueueTicketRepository>();
builder.Services.AddScoped<IQueueTicketService, QueueTicketService>();

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Local"))
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
    await CreateDatabaseIfAvailableAsync(app);
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("LocalWebApp");

app.MapControllers();

app.Run();

static async Task CreateDatabaseIfAvailableAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>()
        .CreateLogger("DatabaseSetup");
    var dbContext = scope.ServiceProvider.GetRequiredService<QueueTicketDbContext>();

    try
    {
        await dbContext.Database.EnsureCreatedAsync();

        if (!await dbContext.QueueCounters.AnyAsync())
        {
            dbContext.QueueCounters.Add(new QueueCounter
            {
                Id = QueueCounter.MainCounterId,
                CurrentIndex = QueueNumberHelper.ResetQueueIndex,
                UpdatedAt = DateTimeOffset.UtcNow
            });

            await dbContext.SaveChangesAsync();
        }
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Database is not ready yet. Start SQL Server with docker compose, then run the API again.");
    }
}
