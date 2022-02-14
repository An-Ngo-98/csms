namespace ProductsApi.Data.Entities
{
    public partial class CsmsProductPhoto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int PhotoId { get; set; }

        public virtual CsmsProduct Product { get; set; }
    }
}
