using System;
using System.Collections.Generic;

namespace SystemApi.Data.Entities
{
    public partial class CsmsBranch
    {
        public CsmsBranch()
        {
            PhoneNumbers = new HashSet<CsmsBranchPhoneNumber>();
        }

        public int Id { get; set; }
        public string ShortName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public TimeSpan OpenTime { get; set; } = new TimeSpan(8, 0, 0);
        public TimeSpan CloseTime { get; set; } = new TimeSpan(22, 0, 0);
        public bool Enabled { get; set; } = true;
        public string Add_Country { get; set; }
        public string Add_Province { get; set; }
        public string Add_District { get; set; }
        public string Add_Ward { get; set; }
        public string Add_Detail { get; set; }
        public string Tables { get; set; }
        public decimal SpaceFee { get; set; }
        public decimal InternetFee { get; set; }
        public bool Deleted { get; set; } = false;
        public virtual ICollection<CsmsBranchPhoneNumber> PhoneNumbers { get; set; }
    }
}
