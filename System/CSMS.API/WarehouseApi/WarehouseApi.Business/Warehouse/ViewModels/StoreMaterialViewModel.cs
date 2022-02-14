using System.Runtime.Serialization;

namespace WarehouseApi.Business.Warehouse.ViewModels
{
    public class StoreMaterialViewModel
    {
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public int MaterialId { get; set; }
        public string MaterialName { get; set; }
        public decimal Amount { get; set; }
        public string Unit { get; set; }

        [IgnoreDataMember]
        public decimal TotalImport { get; set; }
        [IgnoreDataMember]
        public decimal TotalUsed { get; set; }
    }
}
