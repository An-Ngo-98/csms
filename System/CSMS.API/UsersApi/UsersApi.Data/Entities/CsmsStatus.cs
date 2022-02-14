using System.Collections.Generic;

namespace UsersApi.Data.Entities
{
    public partial class CsmsStatus
    {
        public CsmsStatus()
        {
            Users = new HashSet<CsmsUser>();
            UserStatusLogs = new HashSet<CsmsLogUserStatus>();
        }
        public int Id { get; set; }
        public string Status { get; set; }
        public bool IsBlockAccess { get; set; }

        public virtual ICollection<CsmsUser> Users { get; set; }
        public virtual ICollection<CsmsLogUserStatus> UserStatusLogs { get; set; }
    }
}
