namespace ProductsApi.Data.Entities
{
    public partial class CsmsBranchProduct
    {
        public CsmsBranchProduct() { }

        public CsmsBranchProduct(int branchId, int productId)
        {
            this.BranchId = branchId;
            this.ProductId = productId;
        }

        public int Id { get; set; }
        public int BranchId { get; set; }
        public int ProductId { get; set; }

        public virtual CsmsProduct Product { get; set; }
    }
}
