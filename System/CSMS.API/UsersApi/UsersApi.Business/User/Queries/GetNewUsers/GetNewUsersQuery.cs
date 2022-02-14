using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.User.ViewModels;
using UsersApi.Common.Extensions;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.User.Queries.GetNewUsers
{
    public class GetNewUsersQuery : IGetNewUsersQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;

        public GetNewUsersQuery(IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<NewUserViewModel>> ExecuteAsync(DateTime startDate, DateTime endDate)
        {
            startDate = startDate.ChangeTime(0, 0, 0, 0);
            endDate = endDate.ChangeTime(23, 59, 59, 999);

            var result = await _userRepository.TableNoTracking
                .Where(n => n.CreateDate >= startDate && n.CreateDate <= endDate)
                .Select(n => new NewUserViewModel()
                {
                    Id = n.Id
                })
                .ToListAsync();

            return result;
        }
    }
}
