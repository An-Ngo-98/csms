using System;

namespace WarehouseApi.Business.Warehouse.ViewModels
{
    public class ImportExportHistoryViewModel
    {
        public int MaterialId { get; set; }
        public string MaterialName { get; set; }
        public string Unit { get; set; }
        public int? PartnerId { get; set; }
        public string PartnerName { get; set; }
        public int? BranchId { get; set; }
        public string BranchName { get; set; }
        public DateTime Time { get; set; }
        public decimal Quantity { get; set; }
        public string Implementer { get; set; }
        public bool IsImport { get; set; }
    }
}
