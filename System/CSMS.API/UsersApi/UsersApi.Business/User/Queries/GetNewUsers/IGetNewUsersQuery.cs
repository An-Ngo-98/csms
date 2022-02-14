using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UsersApi.Business.User.ViewModels;

namespace UsersApi.Business.User.Queries.GetNewUsers
{
    public interface IGetNewUsersQuery
    {
        Task<List<NewUserViewModel>> ExecuteAsync(DateTime startDate, DateTime endDate);
    }
}