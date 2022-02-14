using System;
using System.Collections.Generic;
using System.Text;

namespace UsersApi.Business.Permission.ViewModels
{
    public class UserPermissionViewModel
    {
        public int permissionId { get; set; }
        public string permissionName { get; set; }
        public string permissionTitle { get; set; }
    }
}
