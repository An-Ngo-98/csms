namespace UsersApi.Data.Entities
{
    public partial class CsmsUserPermission
    {
        public int UserId { get; set; }
        public int PermissionId { get; set; }

        public CsmsUser User { get; set; }
        public CsmsPermission Permisison { get; set; }
    }
}
