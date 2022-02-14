namespace WarehouseApi.Data.Entities
{
    public partial class CsmsUsedMaterialLog
    {
        public int Id { get; set; }
        public int MaterialId { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public decimal Amount { get; set; }

        public virtual CsmsMaterial Material { get; set; }
    }
}
