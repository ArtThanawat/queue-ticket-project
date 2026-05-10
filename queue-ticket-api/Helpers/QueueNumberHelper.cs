namespace QueueTicketApi.Helpers;

public static class QueueNumberHelper
{
    public const int ResetQueueIndex = -1;
    public const string ResetQueueNumber = "00";

    private const int MaxIndex = 259; // A0-Z9

    public static int GetNextIndex(int currentIndex)
    {
        if (currentIndex >= MaxIndex)
        {
            return 0;
        }

        return currentIndex + 1;
    }

    public static string FormatQueueNumber(int index)
    {
        var safeIndex = Math.Clamp(index, 0, MaxIndex);
        var letter = (char)('A' + safeIndex / 10);
        var number = safeIndex % 10;

        return $"{letter}{number}";
    }
}
