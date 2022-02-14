﻿using System;
using System.Collections.Generic;
using System.Text;

namespace UsersApi.Common.Extensions
{
    public static class DateTimeExtension
    {
        public static DateTime ChangeTime(this DateTime dateTime, int hours, int minutes, int seconds = default, int milliseconds = default)
        {
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, hours, minutes, seconds, milliseconds, dateTime.Kind);
        }
    }
}
