using System;

namespace UsersApi.Account.ViewModels
{
    public class TokenViewModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public DateTime? Birthday { get; set; }
        public string Gender { get; set; }
        public DateTime CreatedDate { get; set; }
        public string AccessToken { get; set; }
    }
}
