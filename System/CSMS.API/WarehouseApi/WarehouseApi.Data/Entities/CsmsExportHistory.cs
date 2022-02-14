using System;

namespace WarehouseApi.Data.Entities
{
    public partial class CsmsExportHistory
    {
        public int Id { get; }
        public DateTime ExportDate { get; } = DateTime.Now;
        public int MaterialId { get; set; }
        public decimal QuantityUnit { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }

        public virtual CsmsMaterial Material { get; set; }
    }
}
