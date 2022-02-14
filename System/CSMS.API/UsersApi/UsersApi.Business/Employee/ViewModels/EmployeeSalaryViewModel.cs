using System;

namespace UsersApi.Business.Employee.ViewModels
{
    public class EmployeeSalaryViewModel
    {
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string FullName { get; set; }
        public int? BranchId { get; set; }
        public int? StatusId { get; set; }
        public string Status { get; set; }
        public DateTime ModifiedStatusDate { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public decimal Salary { get; set; }
        public decimal MonthlySalary { get; set; }
        public string Role { get; set; }
    }
}
