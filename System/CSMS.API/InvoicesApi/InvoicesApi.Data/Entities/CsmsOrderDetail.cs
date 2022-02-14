namespace InvoicesApi.Data.Entities
{
    public partial class CsmsOrderDetail
    {
        public string OrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int PhotoId { get; set; } = 0;

        public virtual CsmsOrder Order { get; set; }
    }
}
