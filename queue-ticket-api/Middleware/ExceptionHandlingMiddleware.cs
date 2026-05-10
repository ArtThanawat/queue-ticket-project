using System.Text.Json;
using QueueTicketApi.Responses;

namespace QueueTicketApi.Middleware;

public sealed class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled API error");

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var response = ApiResponse<object>.Fail(
                StatusCodes.Status500InternalServerError,
                "internal server error");

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
