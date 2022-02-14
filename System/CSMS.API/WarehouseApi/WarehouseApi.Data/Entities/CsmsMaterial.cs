using System.Collections;
using System.Collections.Generic;

namespace WarehouseApi.Data.Entities
{
    public partial class CsmsMaterial
    {
        public CsmsMaterial()
        {
            PartnerMaterials = new HashSet<CsmsPartnerMaterial>();
            ExportHistories = new HashSet<CsmsExportHistory>();
            ImportHistories = new HashSet<CsmsImportHistory>();
            StoreExportDefaults = new HashSet<CsmsStoreExportDefault>();
            StoreUsedLogs = new HashSet<CsmsUsedMaterialLog>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public decimal? Amount { get; set; }
        public int? DefaultPartnerId { get; set; }
        public decimal? DefaultQuantity { get; set; } = 0;

        public virtual ICollection<CsmsPartnerMaterial> PartnerMaterials { get; set; }
        public virtual ICollection<CsmsExportHistory> ExportHistories { get; set; }
        public virtual ICollection<CsmsImportHistory> ImportHistories { get; set; }
        public virtual ICollection<CsmsStoreExportDefault> StoreExportDefaults { get; set; }
        public virtual ICollection<CsmsUsedMaterialLog> StoreUsedLogs { get; set; }
    }
}
