using System;

namespace UsersApi.Business.Account.ViewModes
{
    public class UserLoginViewModel
    {
        public int Id { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string PasswordHash { get; set; }
        public DateTime? Birthday { get; set; }
        public string Gender { get; set; }
        public bool Enabled { get; set; }
        public string Reason { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string FullName { get { return (FirstName + " " + MiddleName + " " + LastName).Replace("  ", " "); } }
        public string ShortName { get { return (FirstName + " " + LastName).Replace("  ", " "); } }
        public DateTime CreatedDate { get; set; }
    }
}
