using System;
using System.Collections.Generic;
using System.Text;

namespace SystemApi.Data.Entities
{
    public partial class CsmsBranchPhoneNumber
    {
        public int Id { get; set; }
        public int BranchId { get; set; }
        public string PhoneNumber { get; set; }

        public virtual CsmsBranch Branch { get; set; }
    }
}
