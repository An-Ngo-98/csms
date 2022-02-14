using System;

namespace UsersApi.Business.Employee.ViewModels
{
    public class ListEmployeeViewModel
    {
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public int? BranchId { get; set; }
        public int? StatusId { get; set; }
        public string Status { get; set; }
        public DateTime ModifiedStatusDate { get; set; }
        public string CitizenId { get; set; }
        public string Username { get; set; }
        public DateTime? Birthday { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public decimal Salary { get; set; }
        public string Role { get; set; }
    }
}
