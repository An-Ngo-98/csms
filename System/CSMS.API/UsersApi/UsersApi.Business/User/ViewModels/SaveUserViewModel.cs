using System;

namespace UsersApi.Business.User.ViewModels
{
    public class SaveUserViewModel
    {
        public int Id { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string CitizenId { get; set; }
        public decimal Salary { get; set; }
        public int? BranchId { get; set; }
        public int? RoleId { get; set; }
        public string Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public int? StatusId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
