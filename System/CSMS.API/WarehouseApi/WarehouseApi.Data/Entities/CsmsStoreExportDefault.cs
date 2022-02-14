namespace WarehouseApi.Data.Entities
{
    public partial class CsmsStoreExportDefault
    {
        public int BranchId { get; set; }
        public int MaterialId { get; set; }
        public decimal QuantityUnit { get; set; }

        public virtual CsmsMaterial Material { get; set; }
    }
}
