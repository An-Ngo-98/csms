using System.Collections.Generic;

namespace UsersApi.Data.Entities
{
    public partial class CsmsRole
    {
        public CsmsRole()
        {
            Users = new HashSet<CsmsUser>();
            Permissions = new HashSet<CsmsPermission>();
        }

        public int Id { get; set; }
        public string Role { get; set; }
        public string Title { get; set; }

        public virtual ICollection<CsmsUser> Users { get; set; }
        public virtual ICollection<CsmsPermission> Permissions { get; set; }
    }
}
