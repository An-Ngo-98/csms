using System;

namespace WarehouseApi.Data.Entities
{
    public partial class CsmsPartnerInvoice
    {
        public int Id { get; set; }
        public int PartnerId { get; set; }
        public string InvoiceNo { get; set; }
        public decimal Total { get; set; }
        public DateTime PaidDate { get; set; }

        public virtual CsmsPartner Partner { get; set; }
    }
}
