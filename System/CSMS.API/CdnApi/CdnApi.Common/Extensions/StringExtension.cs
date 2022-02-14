using System;
using System.Collections.Generic;
using System.Text;

namespace CdnApi.Common.Extensions
{
    public static class StringExtension
    {
        public static bool IsEmpty(this string s)
        {
            if ((s == null) || (s.Trim().Length == 0))
                return true;
            return false;
        }
    }
}
