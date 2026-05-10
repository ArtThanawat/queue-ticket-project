using Microsoft.AspNetCore.Mvc;
using QueueTicketApi.Constants;
using QueueTicketApi.Dtos;
using QueueTicketApi.Responses;
using QueueTicketApi.Services;

namespace QueueTicketApi.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController(IQueueTicketService queueTicketService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<HealthCheckDto>>> CheckHealth()
    {
        var data = await queueTicketService.CheckHealthAsync();

        if (data.Database == HealthStatus.Connected)
        {
            return Ok(ApiResponse<HealthCheckDto>.Success(data));
        }

        return StatusCode(
            StatusCodes.Status503ServiceUnavailable,
            ApiResponse<HealthCheckDto>.Fail(
                StatusCodes.Status503ServiceUnavailable,
                "database disconnected"));
    }
}
