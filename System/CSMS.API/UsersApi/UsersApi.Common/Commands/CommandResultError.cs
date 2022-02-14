using System;
using System.Collections.Generic;
using System.Text;

namespace UsersApi.Common.Commands
{
    public class CommandResultError
    {
        public string Description { get; set; }
        public int Code { get; set; }
    }
}
