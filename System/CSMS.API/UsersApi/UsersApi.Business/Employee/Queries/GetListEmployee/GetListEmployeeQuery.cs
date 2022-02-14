using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Employee.ViewModels;
using UsersApi.Common.Enum;
using UsersApi.Common.Extensions;
using UsersApi.Common.Paging;
using UsersApi.Constants;
using UsersApi.Constants.System;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Employee.Queries.GetListEmployee
{
    public class GetListEmployeeQuery : IGetListEmployeeQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;
        private readonly IRepository<CsmsRole> _roleRepository;
        private readonly IRepository<CsmsLogUserStatus> _userStatusLogRepository;

        public GetListEmployeeQuery(
            IRepository<CsmsUser> userRepository,
            IRepository<CsmsRole> roleRepository,
            IRepository<CsmsLogUserStatus> userStatusLogRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _userStatusLogRepository = userStatusLogRepository;
        }

        public async Task<PagedList<ListEmployeeViewModel>> ExecuteAsync(int page, int pageSize, int sortField, int sortType, int? branchId, int? employeeStatus, int? searchBy, string startDate, string endDate, string searchString)
        {
            try
            {
                var data = await GetDataAsync(branchId, employeeStatus, searchBy, startDate, endDate, searchString);
                data = SortData(data, sortField, sortType);

                var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
                List<ListEmployeeViewModel> list = new List<ListEmployeeViewModel>();

                int total = 0;
                list = result.ToList();

                total = data.Count();
                return new PagedList<ListEmployeeViewModel>(list, page, pageSize, total);
            }
            catch (Exception)
            {
                //Logging<GetListEmployeeQuery>.Error(ex, "Data: " + JsonConvert.SerializeObject(page + pageSize + sortField + sortType + departmentCode + status + searchBy + startDate + endDate + searchString));
                return new PagedList<ListEmployeeViewModel>(new List<ListEmployeeViewModel>(), 1, 1, 0);
            }
        }

        private async Task<IEnumerable<ListEmployeeViewModel>> GetDataAsync(int? branchId, int? employeeStatus, int? searchBy, string startDate, string endDate, string searchString)
        {
            var customerRole = _roleRepository.TableNoTracking
                .Where(n => n.Role == RolesConstant.ROLE_CUSTOMER).FirstOrDefaultAsync();

            int customerRoleId = customerRole == null ? 0 : customerRole.Result.Id;

            var data = await _userRepository.TableNoTracking
                .Where(n =>
                    (n.Deleted != true) &&
                    (n.RoleId != customerRoleId || n.RoleId == null) &&
                    (branchId != 0 ? n.BranchId == branchId : true) &&
                    (employeeStatus.HasValue ? n.StatusId == employeeStatus : true))
                .Include(n => n.Status)
                .Include(n => n.UserStatusLogs)
                .Include(n => n.Addresses)
                .Include(n => n.Role)
                .ToListAsync();

            var result = data.Select(n => new ListEmployeeViewModel()
            {
                EmployeeId = n.Id,
                EmployeeCode = n.UserCode,
                FirstName = n.FirstName,
                MiddleName = n.MiddleName,
                LastName = n.LastName,
                Birthday = n.Birthday,
                CitizenId = n.CitizenID,
                Email = n.Email,
                Gender = n.Gender,
                Username = n.Username,
                PhoneNumber = n.PhoneNumber,
                BranchId = n.BranchId,
                StatusId = n.StatusId,
                Status = n.Status.Status,
                Salary = n.Salary,
                ModifiedStatusDate = n.UserStatusLogs.Last().ModifiedDate,
                Role = n.Role == null ? null : n.Role.Title,
                Address = n.Addresses.Count == 0 ? null : n.Addresses.First().District + ", " + n.Addresses.First().Province,
                FullName = n.FirstName + (n.MiddleName.IsEmpty() ? " " : " " + n.MiddleName + " ") + n.LastName
            }).ToList();

            return FilterData(result, searchBy, startDate, endDate, searchString);
        }
        
        private IEnumerable<ListEmployeeViewModel> FilterData(List<ListEmployeeViewModel> data, int? searchBy, string startDate, string endDate, string searchString)
        {
            IEnumerable<ListEmployeeViewModel> query = data;

            if (searchBy.HasValue)
            {
                DateTime? _startDate = startDate.TryConvertToDateTime();
                DateTime? _endDate = endDate.TryConvertToDateTime();

                switch (searchBy)
                {
                    case (int)SearchBy.StartedWorking:
                        query = query.Where(x =>
                            (x.StatusId == (int)UserStatus.StartedWorking) &&
                            (_startDate != null ? _startDate <= x.ModifiedStatusDate : true) &&
                            (_endDate != null ? x.ModifiedStatusDate <= _endDate : true));
                        break;

                    case (int)SearchBy.Terminated:
                        query = query.Where(x =>
                            (x.StatusId == (int)UserStatus.Terminated) &&
                            (_startDate != null ? _startDate <= x.ModifiedStatusDate : true) &&
                            (_endDate != null ? x.ModifiedStatusDate <= _endDate : true));
                        break;
                    case (int)SearchBy.Blocked:
                        query = query.Where(x =>
                            (x.StatusId == (int)UserStatus.Blocked) &&
                            (_startDate != null ? _startDate <= x.ModifiedStatusDate : true) &&
                            (_endDate != null ? x.ModifiedStatusDate <= _endDate : true));
                        break;
                    case (int)SearchBy.Birthday:
                        query = query.Where(x =>
                            (_startDate != null ? _startDate <= x.Birthday : true) &&
                            (_endDate != null ? x.Birthday <= _endDate : true));
                        break;
                }
            }

            query = SearchString(query, searchString);
            return query;
        }

        private IEnumerable<ListEmployeeViewModel> SearchString(IEnumerable<ListEmployeeViewModel> data, string searchString)
        {
            List<ListEmployeeViewModel> result = data.ToList();

            if (!string.IsNullOrEmpty(searchString))
            {
                result = new List<ListEmployeeViewModel>();
                char[] delimiter = { ',', ';' };
                string[] listSearch = searchString.ToLower().Split(delimiter);

                foreach (var item in listSearch)
                {
                    var value = item.ToLower().Trim();

                    var temp = data.Where(x => ((x.FirstName + " " + x.MiddleName + " " + x.LastName).ToLower().Replace("  ", " ").Contains(value)
                       || (x.LastName + " " + x.MiddleName + " " + x.FirstName).ToLower().Replace("  ", " ").Contains(value)
                       || (x.FirstName + " " + x.LastName).ToLower().Contains(value)
                       || (x.LastName + " " + x.FirstName).ToLower().Contains(value))
                       || (x.EmployeeCode != null && x.EmployeeCode.ToLower().Contains(value))
                       || (x.CitizenId != null && x.CitizenId.Replace(" ", "").Contains(value))
                       || (x.PhoneNumber != null && x.PhoneNumber.ToLower().Replace(" ", "").Contains(value))
                       || (x.Username != null && x.Username.ToLower().Contains(value))
                       || (x.Address != null && x.Address.ToLower().Contains(value))
                       || (x.Email != null && x.Email.ToLower().Contains(value)));

                    result.AddRange(temp.ToList());
                }
            }

            return result.Distinct() as IEnumerable<ListEmployeeViewModel>;
        }

        private IEnumerable<ListEmployeeViewModel> SortData(IEnumerable<ListEmployeeViewModel> data, int sortField, int sortType)
        {
            switch (sortField)
            {
                case (int)SortField.EmployeeName:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.FullName);
                    }

                    return data.OrderByDescending(x => x.FullName);

                case (int)SortField.Branch:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.BranchId);
                    }

                    return data.OrderByDescending(x => x.BranchId);

                case (int)SortField.Birthday:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.Birthday);
                    }

                    return data.OrderByDescending(x => x.Birthday);

                case (int)SortField.Username:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.Username);
                    }

                    return data.OrderByDescending(x => x.Username);

                case (int)SortField.Email:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.Email);
                    }

                    return data.OrderByDescending(x => x.Email);

                case (int)SortField.PhoneNumber:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.PhoneNumber);
                    }

                    return data.OrderByDescending(x => x.PhoneNumber);

                case (int)SortField.Gender:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.Gender);
                    }

                    return data.OrderByDescending(x => x.Gender);

                case (int)SortField.Address:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.Address);
                    }

                    return data.OrderByDescending(x => x.Address);

                case (int)SortField.Status:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.Status);
                    }

                    return data.OrderByDescending(x => x.Status);

                default:
                    if (sortType == (int)SortType.ASC)
                    {
                        return data.OrderBy(x => x.EmployeeCode);
                    }

                    return data.OrderByDescending(x => x.EmployeeCode);
            }
        }
    }

    enum SortField
    {
        EmployeeCode = 1,
        EmployeeName = 2,
        Branch = 3,
        Birthday = 4,
        Username = 5,
        Email = 6,
        PhoneNumber = 7,
        Gender = 8,
        Address = 9,
        Status = 10
    }

    enum SearchBy
    {
        None = 0,
        StartedWorking = 1,
        Terminated = 2,
        Blocked = 3,
        Birthday = 4
    }
}
