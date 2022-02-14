using System;

namespace InvoicesApi.Common.Extentions
{
    public static class DateTimeExtension
    {
        public static DateTime ChangeTime(this DateTime dateTime, int hours, int minutes, int seconds = default, int milliseconds = default)
        {
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, hours, minutes, seconds, milliseconds, dateTime.Kind);
        }

        public static bool EqualsUpToDay(this DateTime dt1, DateTime dt2)
        {
            return dt1.Year == dt2.Year && dt1.Month == dt2.Month && dt1.Day == dt2.Day;
        }

        public static int CountDays(DateTime startDate, DateTime endDate)
        {
            int count = 0;

            for (DateTime dt = startDate; dt < endDate; dt = dt.AddDays(1.0))
            {
                count++;
            }

            return count;
        }
    }
}
