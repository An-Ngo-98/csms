using System.Collections.Generic;

namespace UsersApi.Data.Entities
{
    public partial class CsmsPermission
    {
        public CsmsPermission()
        {
            UserOtherPermisisons = new HashSet<CsmsUserPermission>();
        }

        public int Id { get; set; }
        public int RoleId { get; set; }
        public string Permission { get; set; }
        public string Title { get; set; }

        public virtual CsmsRole Role { get; set; }
        public virtual ICollection<CsmsUserPermission> UserOtherPermisisons { get; set; }
    }
}
