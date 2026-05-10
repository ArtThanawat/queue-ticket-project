using Microsoft.AspNetCore.Mvc;
using QueueTicketApi.Dtos;
using QueueTicketApi.Responses;
using QueueTicketApi.Services;

namespace QueueTicketApi.Controllers;

[ApiController]
[Route("api/queue-tickets")]
public sealed class QueueTicketsController(IQueueTicketService queueTicketService) : ControllerBase
{
    [HttpGet("current")]
    public async Task<ActionResult<ApiResponse<QueueTicketDto>>> GetCurrentTicket()
    {
        var data = await queueTicketService.GetCurrentTicketAsync();

        return Ok(ApiResponse<QueueTicketDto>.Success(data));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<QueueTicketDto>>> CreateTicket()
    {
        var data = await queueTicketService.CreateTicketAsync();

        return Ok(ApiResponse<QueueTicketDto>.Success(data));
    }

    [HttpPost("reset")]
    public async Task<ActionResult<ApiResponse<QueueTicketDto>>> ResetQueue()
    {
        var data = await queueTicketService.ResetQueueAsync();

        return Ok(ApiResponse<QueueTicketDto>.Success(data));
    }
}
