using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Employee.ViewModels;
using UsersApi.Common.Enum;
using UsersApi.Common.Extensions;
using UsersApi.Constants.System;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Employee.Queries.GetSalaryByMonth
{
    public class GetSalaryByMonthQuery : IGetSalaryByMonthQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;
        private readonly IRepository<CsmsRole> _roleRepository;
        private readonly IRepository<CsmsLogUserStatus> _userStatusLogRepository;

        public GetSalaryByMonthQuery(
            IRepository<CsmsUser> userRepository,
            IRepository<CsmsRole> roleRepository,
            IRepository<CsmsLogUserStatus> userStatusLogRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _userStatusLogRepository = userStatusLogRepository;
        }
        public async Task<List<EmployeeSalaryViewModel>> ExecuteAsync(int? branchId, int month, int year)
        {
            var customerRole = _roleRepository.TableNoTracking
                .Where(n => n.Role == RolesConstant.ROLE_CUSTOMER).FirstOrDefaultAsync();

            int customerRoleId = customerRole == null ? 0 : customerRole.Result.Id;
            var data = await _userRepository.TableNoTracking
                    .Where(n =>
                        (n.Deleted != true) &&
                        (n.RoleId != customerRoleId || n.RoleId == null) &&
                        (branchId != 0 ? n.BranchId == branchId : true))
                    .Include(n => n.Status)
                    .Include(n => n.UserStatusLogs)
                    .Include(n => n.Addresses)
                    .Include(n => n.Role)
                    .ToListAsync();

            var result = data.Select(n => new EmployeeSalaryViewModel()
            {
                EmployeeId = n.Id,
                EmployeeCode = n.UserCode,
                Email = n.Email,
                Username = n.Username,
                PhoneNumber = n.PhoneNumber,
                BranchId = n.BranchId,
                StatusId = n.StatusId,
                Status = n.Status.Status,
                Salary = n.Salary,
                MonthlySalary = n.Salary,
                ModifiedStatusDate = n.UserStatusLogs.Last().ModifiedDate,
                Role = n.Role == null ? null : n.Role.Title,
                FullName = n.FirstName + (n.MiddleName.IsEmpty() ? " " : " " + n.MiddleName + " ") + n.LastName
            }).ToList();

            foreach (var user in result)
            {
                int totalDayOfMonth = DateTime.DaysInMonth(year, month);
                DateTime startDateOfMonth = DateTime.Parse(month.ToString() + "/01/" + year.ToString() + " 00:00:00");
                DateTime endDateOfMonth = DateTime.Parse(month.ToString() + "/" + totalDayOfMonth + "/" + year.ToString() + " 23:59:59");
                if (user.ModifiedStatusDate > startDateOfMonth)
                {
                    if (user.StatusId == (int)UserStatus.StartedWorking)
                    {
                        user.MonthlySalary = user.Salary / totalDayOfMonth * (decimal)(endDateOfMonth - user.ModifiedStatusDate).TotalDays;
                    }
                    else
                    {
                        user.MonthlySalary = user.Salary / totalDayOfMonth * (decimal)(user.ModifiedStatusDate - startDateOfMonth).TotalDays;
                    }
                }
            }

            return result;
        }
    }
}
