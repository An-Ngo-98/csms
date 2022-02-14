using System;
using System.Collections.Generic;

namespace UsersApi.Business.User.ViewModels
{
    public class UserInfoViewModel
    {
        public int Id { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string CitizenId { get; set; }
        public string Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public decimal Salary { get; set; }
        public int? StatusId { get; set; }
        public int? BranchId { get; set; }
        public int? RoleId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }

        public List<UserAddressViewModel> Addresses { get; set; }
    }

    public class UserAddressViewModel
    {
        public int Id { get; set; }
        public string Receiver { get; set; }
        public string PhoneNumber { get; set; }
        public string Country { get; set; }
        public string Province { get; set; }
        public string District { get; set; }
        public string Ward { get; set; }
        public string Detail { get; set; }
        public bool IsDefault { get; set; }
    }
}
