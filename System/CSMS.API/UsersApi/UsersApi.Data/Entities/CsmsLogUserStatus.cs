using System;
using System.Collections.Generic;
using System.Text;

namespace UsersApi.Data.Entities
{
    public class CsmsLogUserStatus
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int StatusId { get; set; }
        public DateTime ModifiedDate { get; set; }

        public virtual CsmsUser User { get; set; }
        public virtual CsmsStatus Status { get; set; }
    }
}
