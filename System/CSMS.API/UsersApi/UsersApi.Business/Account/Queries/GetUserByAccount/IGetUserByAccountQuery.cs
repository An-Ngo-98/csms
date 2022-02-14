using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using UsersApi.Business.Account.ViewModes;
using UsersApi.Data.Entities;

namespace UsersApi.Business.Account.Queries.GetUserByAccount
{
    public interface IGetUserByAccountQuery
    {
        Task<UserLoginViewModel> ExecuteAsync(string username, string inputPassword);
    }
}
