using System;

namespace UsersApi.Business.Customer.ViewModels
{
    public class SaveCustomerSocialViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string idToken { get; set; }
        public string provider { get; set; }
    }
}
