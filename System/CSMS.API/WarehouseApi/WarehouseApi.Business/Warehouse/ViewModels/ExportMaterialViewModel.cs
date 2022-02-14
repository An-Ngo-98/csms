namespace WarehouseApi.Business.Warehouse.ViewModels
{
    public class ExportMaterialViewModel
    {
        public int MaterialId { get; set; }
        public decimal QuantityUnit { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
    }
}
