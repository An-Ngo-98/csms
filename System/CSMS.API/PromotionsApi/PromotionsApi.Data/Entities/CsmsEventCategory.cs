namespace PromotionsApi.Data.Entities
{
    public partial class CsmsEventCategory
    {
        public int EventId { get; set; }
        public int CategoryId { get; set; }

        public virtual CsmsEvent Event { get; set; }
    }
}
