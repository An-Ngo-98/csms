using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SystemApi.Common.Extentions
{
    public static class StringExtension
    {
        public static bool IsEmpty(this string s)
        {
            if ((s == null) || (s.Trim().Length == 0))
                return true;
            return false;
        }

        public static string HandleEmpty(this string s, string replace)
        {
            if ((s == null) || (s.Trim().Length == 0))
                return replace;
            return s;
        }

        public static List<int> ParseToToListNumber(this string s, char separator)
        {
            List<int> result = new List<int>();
            foreach (var day in s.Split(separator).ToList())
            {
                int parseDay;
                if (int.TryParse(day.Trim(), out parseDay))
                {
                    result.Add(parseDay);
                }
            }
            return result;
        }
    }
}
