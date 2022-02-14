using Microsoft.Extensions.DependencyInjection;

namespace ProductsApi.Framework.Authorization
{
    public static class AuthorizationServiceCollectionExtension
    {
        public static IServiceCollection ConfigurePermissions(this IServiceCollection services)
        {
            // Roles
            services.AddAuthorizationCore(opts => opts.AddPolicy(
                Roles.CUSTOMER, policy => policy.RequireClaim("Role", Roles.CUSTOMER, Roles.ADMIN_STORE, Roles.ADMIN_SYSTEM,
                    Roles.EMPLOYEE_GUARD, Roles.EMPLOYEE_SELLER, Roles.EMPLOYEE_SHIPPER, Roles.EMPLOYEE_WAITER)));
            services.AddAuthorizationCore(opts => opts.AddPolicy(
                Roles.EMPLOYEE_GUARD, policy => policy.RequireClaim("Role", Roles.EMPLOYEE_GUARD)));
            services.AddAuthorizationCore(opts => opts.AddPolicy(
                Roles.EMPLOYEE_SHIPPER, policy => policy.RequireClaim("Role", Roles.EMPLOYEE_SHIPPER, Roles.EMPLOYEE_GUARD)));
            services.AddAuthorizationCore(opts => opts.AddPolicy(
                Roles.EMPLOYEE_WAITER, policy => policy.RequireClaim("Role", Roles.EMPLOYEE_WAITER, Roles.EMPLOYEE_GUARD)));
            services.AddAuthorizationCore(opts => opts.AddPolicy(
                Roles.EMPLOYEE_SELLER, policy => policy.RequireClaim("Role", Roles.EMPLOYEE_SELLER, Roles.EMPLOYEE_GUARD)));
            services.AddAuthorizationCore(opts => opts.AddPolicy(
                Roles.ADMIN_SYSTEM, policy => policy.RequireClaim("Role", Roles.ADMIN_SYSTEM)));
            services.AddAuthorizationCore(opts => opts.AddPolicy(
                Roles.ADMIN_STORE, policy => policy.RequireClaim("Role", Roles.ADMIN_STORE, Roles.EMPLOYEE_SELLER)));

            // Permission
            //services.AddAuthorizationCore(opts => opts.AddPolicy(
            //    PermissionCustomer.UPLOAD_USERS_AVATAR, policy => policy.RequireClaim("Permission", PermissionCustomer.UPLOAD_USERS_AVATAR)));
            //services.AddAuthorizationCore(opts => opts.AddPolicy(
            //    PermissionCustomer.EDIT_USER_INFO, policy => policy.RequireClaim("Permission", PermissionCustomer.EDIT_USER_INFO)));

            return services;
        }
    }
}
