namespace PromotionsApi.Data.Entities
{
    public partial class CsmsEventDevice
    {
        public int EventId { get; set; }
        public int DeviceId { get; set; }

        public virtual CsmsEvent Event { get; set; }
        public virtual CsmsDevice Device { get; set; }
    }
}
