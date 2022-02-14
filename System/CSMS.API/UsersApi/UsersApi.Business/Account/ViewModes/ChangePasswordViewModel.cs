namespace UsersApi.Business.Account.ViewModes
{
    public class ChangePasswordViewModel
    {
        public int UserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
