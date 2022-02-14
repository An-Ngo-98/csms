using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Common.Enum;
using UsersApi.Common.Extensions;
using UsersApi.Common.Paging;
using UsersApi.Constants.System;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Customer.Queries.GetListCustomer
{
    public class GetListCustomerQuery : IGetListCustomerQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;
        private readonly IRepository<CsmsRole> _roleRepository;
        private readonly IRepository<CsmsLogUserStatus> _userStatusLogRepository;

        public GetListCustomerQuery(
            IRepository<CsmsUser> userRepository,
            IRepository<CsmsRole> roleRepository,
            IRepository<CsmsLogUserStatus> userStatusLogRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _userStatusLogRepository = userStatusLogRepository;
        }

        public async Task<PagedList<ListCustomerViewModel>> ExecuteAsync(int page, int pageSize, int sortField, int sortType, int? customerStatus, string searchString)
        {
            try
            {
                var data = await GetDataAsync(customerStatus, searchString);
                data = SortData(data, sortField, sortType);

                var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
                List<ListCustomerViewModel> list = new List<ListCustomerViewModel>();

                int total = 0;
                list = result.ToList();

                total = data.Count();
                return new PagedList<ListCustomerViewModel>(list, page, pageSize, total);
            }
            catch (Exception)
            {
                //Logging<GetListEmployeeQuery>.Error(ex, "Data: " + JsonConvert.SerializeObject(page + pageSize + sortField + sortType + departmentCode + status + searchBy + startDate + endDate + searchString));
                return new PagedList<ListCustomerViewModel>(new List<ListCustomerViewModel>(), 1, 1, 0);
            }
        }

        private async Task<IEnumerable<ListCustomerViewModel>> GetDataAsync(int? status, string searchString)
        {
            var customerRole = _roleRepository.TableNoTracking
                .Where(n => n.Role == RolesConstant.ROLE_CUSTOMER).FirstOrDefaultAsync();

            int customerRoleId = customerRole == null ? 0 : customerRole.Result.Id;

            var data = await _userRepository.TableNoTracking
                .Where(n =>
                    (n.Deleted != true) &&
                    (n.RoleId == customerRoleId) &&
                    (status.HasValue ? n.StatusId == status : true))
                .Include(n => n.Status)
                .Include(n => n.UserStatusLogs)
                .Include(n => n.Addresses)
                .ToListAsync();

            var result = data.Select(n => new ListCustomerViewModel()
            {
                CustomerId = n.Id,
                FirstName = n.FirstName,
                MiddleName = n.MiddleName,
                LastName = n.LastName,
                Birthday = n.Birthday,
                CitizenId = n.CitizenID,
                Email = n.Email,
                Gender = n.Gender,
                Username = n.Username,
                PhoneNumber = n.PhoneNumber,
                StatusId = n.StatusId,
                Status = n.Status.Status,
                ModifiedStatusDate = n.UserStatusLogs.Last().ModifiedDate,
                Address = n.Addresses.Count == 0 ? null : n.Addresses.First().District + ", " + n.Addresses.First().Province,
                FullName = n.FirstName + (n.MiddleName.IsEmpty() ? " " : " " + n.MiddleName + " ") + n.LastName
            }).ToList();

            return SearchString(result, searchString);
        }

        private IEnumerable<ListCustomerViewModel> SearchString(IEnumerable<ListCustomerViewModel> data, string searchString)
        {
            List<ListCustomerViewModel> result = data.ToList();

            if (!string.IsNullOrEmpty(searchString))
            {
                result = new List<ListCustomerViewModel>();
                char[] delimiter = { ',', ';' };
                string[] listSearch = searchString.ToLower().Split(delimiter);

                foreach (var item in listSearch)
                {
                    var value = item.ToLower().Trim();

                    var temp = data.Where(x => ((x.FirstName + " " + x.MiddleName + " " + x.LastName).ToLower().Replace("  ", " ").Contains(value)
                       || (x.LastName + " " + x.MiddleName + " " + x.FirstName).ToLower().Replace("  ", " ").Contains(value)
                       || (x.FirstName + " " + x.LastName).ToLower().Contains(value)
                       || (x.LastName + " " + x.FirstName).ToLower().Contains(value))
                       || (x.CitizenId != null && x.CitizenId.Replace(" ", "").Contains(value))
                       || (x.PhoneNumber != null && x.PhoneNumber.ToLower().Replace(" ", "").Contains(value))
                       || (x.Username != null && x.Username.ToLower().Contains(value))
                       || (x.Address != null && x.Address.ToLower().Contains(value))
                       || (x.Email != null && x.Email.ToLower().Contains(value)));

                    result.AddRange(temp.ToList());
                }
            }

            return result.Distinct() as IEnumerable<ListCustomerViewModel>;
        }

        private IEnumerable<ListCustomerViewModel> SortData(IEnumerable<ListCustomerViewModel> data, int sortField, int sortType)
        {
            switch (sortField)
            {
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
                        return data.OrderBy(x => x.FullName);
                    }

                    return data.OrderByDescending(x => x.FullName);
            }
        }
    }

    enum SortField
    {
        CustomerName = 1,
        Birthday = 2,
        Username = 3,
        Email = 4,
        PhoneNumber = 5,
        Gender = 6,
        Address = 7,
        Status = 8
    }
}
