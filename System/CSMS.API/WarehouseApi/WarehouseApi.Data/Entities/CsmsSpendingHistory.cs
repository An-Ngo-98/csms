using System;

namespace WarehouseApi.Data.Entities
{
    public partial class CsmsSpendingHistory
    {
        public string BillCode { get; set; }
        public int? BranchId { get; set; }
        public string BranchName { get; set; }
        public string SpendTypeId { get; set; }
        public int? PartnerId { get; set; }
        public decimal Total { get; set; }
        public DateTime SpentTime { get; set; }
        public string Remark { get; set; }

        public virtual CsmsSpendType SpendType { get; set; }
        public virtual CsmsPartner Partner { get; set; }
    }
}
