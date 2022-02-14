using DryIoc;
using System;
using System.Net.Http;
using UsersApi.Business.Account.Commands.ChangePassword;
using UsersApi.Business.Account.Queries.GetCustomerByAccount;
using UsersApi.Business.Account.Queries.GetCustomerInfoFromAccessToken;
using UsersApi.Business.Account.Queries.GetUserByAccount;
using UsersApi.Business.Customer.Commands.SaveCustomer;
using UsersApi.Business.Customer.Queries.ExportListCustomer;
using UsersApi.Business.Customer.Queries.GetListAddressByUserId;
using UsersApi.Business.Customer.Queries.GetListCustomer;
using UsersApi.Business.Employee.Queries.ExportListEmployee;
using UsersApi.Business.Employee.Queries.GetListEmployee;
using UsersApi.Business.Employee.Queries.GetSalaryByMonth;
using UsersApi.Business.Permission.Queries.GetPermissionsByUserId;
using UsersApi.Business.Role.Queries.GetAllRole;
using UsersApi.Business.Role.Queries.GetRolesByUserId;
using UsersApi.Business.User.Commands.DeleteUserAddressByAddressId;
using UsersApi.Business.User.Commands.DeleteUserByUserId;
using UsersApi.Business.User.Commands.SaveUser;
using UsersApi.Business.User.Commands.SaveUserAddress;
using UsersApi.Business.User.Queries.GetNewUsers;
using UsersApi.Business.User.Queries.GetUserInfoByUserId;
using UsersApi.Data.Services;

namespace UsersApi.Framework.IoCRegistrar
{
    public class CompositionRoot
    {
        public CompositionRoot(IRegistrator registrator)
        {
            // General
            registrator.Register<Lazy<HttpClient>>(Reuse.InWebRequest);
            registrator.Register<IDbContext, ApplicationDbContext>(Reuse.InWebRequest);
            registrator.Register(typeof(IRepository<>), typeof(EfRepository<>), Reuse.InWebRequest);

            // Account Business
            registrator.Register<IGetUserByAccountQuery, GetUserByAccountQuery>(Reuse.InWebRequest);
            registrator.Register<IGetCustomerByAccountQuery, GetCustomerByAccountQuery>(Reuse.InWebRequest);
            registrator.Register<IChangePasswordCommand, ChangePasswordCommand>(Reuse.InWebRequest);
            registrator.Register<IGetCustomerInfoFromAccessTokenQuery, GetCustomerInfoFromAccessTokenQuery>(Reuse.InWebRequest);

            // Role Business
            registrator.Register<IGetRolesByUserIdQuery, GetRolesByUserIdQuery>(Reuse.InWebRequest);
            registrator.Register<IGetAllRoleQuery, GetAllRoleQuery>(Reuse.InWebRequest);

            // Permisison Business
            registrator.Register<IGetPermissionsByUserIdQuery, GetPermissionsByUserIdQuery>(Reuse.InWebRequest);

            // User Business
            registrator.Register<IGetUserInfoByUserIdQuery, GetUserInfoByUserIdQuery>(Reuse.InWebRequest);
            registrator.Register<IGetNewUsersQuery, GetNewUsersQuery>(Reuse.InWebRequest);
            registrator.Register<IDeleteUserByUserIdCommand, DeleteUserByUserIdCommand>(Reuse.InWebRequest);
            registrator.Register<ISaveUserCommand, SaveUserCommand>(Reuse.InWebRequest);
            registrator.Register<ISaveUserAddressCommand, SaveUserAddressCommand>(Reuse.InWebRequest);
            registrator.Register<IDeleteUserAddressByAddressIdCommand, DeleteUserAddressByAddressIdCommand>(Reuse.InWebRequest);

            // Employee Business
            registrator.Register<IGetListEmployeeQuery, GetListEmployeeQuery>(Reuse.InWebRequest);
            registrator.Register<IExportListEmployeeQuery, ExportListEmployeeQuery>(Reuse.InWebRequest);
            registrator.Register<IGetSalaryByMonthQuery, GetSalaryByMonthQuery>(Reuse.InWebRequest);

            // Customer Business
            registrator.Register<IGetListCustomerQuery, GetListCustomerQuery>(Reuse.InWebRequest);
            registrator.Register<IExportListCustomerQuery, ExportListCustomerQuery>(Reuse.InWebRequest);
            registrator.Register<ISaveCustomerCommand, SaveCustomerCommand>(Reuse.InWebRequest);
            registrator.Register<IGetListAddressByUserIdQuery, GetListAddressByUserIdQuery>(Reuse.InWebRequest);
        }
    }
}
