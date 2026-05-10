namespace QueueTicketApi.Responses;

public sealed class ApiResponse<T>
{
    public int Status { get; set; }

    public string Message { get; set; } = string.Empty;

    public T? Data { get; set; }

    public static ApiResponse<T> Success(T data, string message = "success")
    {
        return new ApiResponse<T>
        {
            Status = StatusCodes.Status200OK,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> Fail(int status, string message)
    {
        return new ApiResponse<T>
        {
            Status = status,
            Message = message,
            Data = default
        };
    }
}
