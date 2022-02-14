using System;
using System.Collections.Generic;

namespace UsersApi.Data.Entities
{
    public partial class CsmsUser
    {
        public CsmsUser()
        {
            Addresses = new HashSet<CsmsUserAddress>();
            UserOtherPermisisons = new HashSet<CsmsUserPermission>();
            UserStatusLogs = new HashSet<CsmsLogUserStatus>();
        }

        public int Id { get; set; }
        public string UserCode { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string CitizenID { get; set; }
        public string Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public decimal Salary { get; set; }
        public int? RoleId { get; set; }
        public int? BranchId { get; set; }
        public int? StatusId { get; set; }
        public bool? Deleted { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;
        public DateTime? UpdateDate { get; set; }

        public virtual CsmsStatus Status { get; set; }
        public virtual CsmsRole Role { get; set; }

        public virtual ICollection<CsmsUserAddress> Addresses { get; set; }
        public virtual ICollection<CsmsUserPermission> UserOtherPermisisons { get; set; }
        public virtual ICollection<CsmsLogUserStatus> UserStatusLogs { get; set; }
    }
}
