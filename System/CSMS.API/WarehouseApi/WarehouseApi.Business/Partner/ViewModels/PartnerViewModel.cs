using System.Collections.Generic;
using WarehouseApi.Business.Material.ViewModels;

namespace WarehouseApi.Business.Partner.ViewModels
{
    public class PartnerViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }

        public List<PartnerMaterialViewModel> Materials { get; set; }
    }

    public class PartnerMaterialViewModel
    {
        public int Id { get; set; }
        public int MaterialId { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public decimal? Amount { get; set; }
        public decimal Price { get; set; }
        public int? MaxUnit { get; set; }
    }
}
