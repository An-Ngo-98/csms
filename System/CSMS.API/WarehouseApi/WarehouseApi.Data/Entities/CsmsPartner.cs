using System.Collections.Generic;

namespace WarehouseApi.Data.Entities
{
    public partial class CsmsPartner
    {
        public CsmsPartner()
        {
            PartnerMaterials = new HashSet<CsmsPartnerMaterial>();
            ImportHistories = new HashSet<CsmsImportHistory>();
            Invoices = new HashSet<CsmsPartnerInvoice>();
            SpendingHistories = new HashSet<CsmsSpendingHistory>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }

        public virtual ICollection<CsmsPartnerMaterial> PartnerMaterials { get; set; }
        public virtual ICollection<CsmsImportHistory> ImportHistories { get; set; }
        public virtual ICollection<CsmsPartnerInvoice> Invoices { get; set; }
        public virtual ICollection<CsmsSpendingHistory> SpendingHistories { get; set; }
    }
}
