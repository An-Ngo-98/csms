using System;

namespace WarehouseApi.Business.Bill.ViewModels
{
    public class BillViewModel
    {
        public string BillCode { get; set; }
        public string SpendType { get; set; }
        public string SpendTypeName { get; set; }
        public int? BranchId { get; set; }
        public int? PartnerId { get; set; }
        public string PartnerName { get; set; }
        public string BranchName { get; set; }
        public DateTime BillTime { get; set; }
        public decimal? Total { get; set; }
        public string Remark { get; set; }
        public bool HavePaid { get; set; }
    }
}
