using System.Collections.Generic;

namespace SystemApi.Business.Branch.ViewModels
{
    public class EnableBranchViewModel
    {
        public int Id { get; set; }
        public string ShortName { get; set; }
        public string Name { get; set; }
        public string OpenTime { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string Tables { get; set; }
        public decimal SpaceFee { get; set; }
        public decimal InternetFee { get; set; }
        public List<string> PhoneNumbers { get; set; }
    }
}
