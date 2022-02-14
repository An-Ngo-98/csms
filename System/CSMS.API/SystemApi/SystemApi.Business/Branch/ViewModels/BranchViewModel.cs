using System.Collections.Generic;
using SystemApi.Data.Entities;

namespace SystemApi.Business.Branch.ViewModels
{
    public class BranchViewModel
    {
        public BranchViewModel()
        {
            PhoneNumbers = new List<BranchPhoneNumberViewModel>();
        }

        public int Id { get; set; }
        public string ShortName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string OpenTime { get; set; }
        public string CloseTime { get; set; }
        public bool Enabled { get; set; } = true;
        public string Add_Country { get; set; }
        public string Add_Province { get; set; }
        public string Add_District { get; set; }
        public string Add_Ward { get; set; }
        public string Add_Detail { get; set; }
        public string Tables { get; set; }
        public decimal SpaceFee { get; set; }
        public decimal InternetFee { get; set; }
        public List<BranchPhoneNumberViewModel> PhoneNumbers { get; set; }
    }

    public class BranchPhoneNumberViewModel
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; }
    }
}
