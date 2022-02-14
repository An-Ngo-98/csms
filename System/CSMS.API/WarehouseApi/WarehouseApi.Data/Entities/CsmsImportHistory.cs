using System;

namespace WarehouseApi.Data.Entities
{
    public partial class CsmsImportHistory
    {
        public int Id { get; }
        public DateTime ImportDate { get; } = DateTime.Now;
        public int PartnerId { get; set; }
        public int MaterialId { get; set; }
        public decimal QuantityUnit { get; set; }
        public decimal Price { get; set; }
        public decimal TotalPrice { get; set; }
        public bool HavePaid { get; set; }

        public virtual CsmsMaterial Material { get; set; }
        public virtual CsmsPartner Partner { get; set; }
    }
}
