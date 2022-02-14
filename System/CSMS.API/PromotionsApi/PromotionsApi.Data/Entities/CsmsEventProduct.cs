namespace PromotionsApi.Data.Entities
{
    public partial class CsmsEventProduct
    {
        public int EventId { get; set; }
        public int ProductId { get; set; }

        public virtual CsmsEvent Event { get; set; }
    }
}
