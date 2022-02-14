using System.Collections.Generic;

namespace PromotionsApi.Data.Entities
{
    public partial class CsmsDevice
    {
        public CsmsDevice()
        {
            EventDevices = new HashSet<CsmsEventDevice>();
        }

        public int Id { get; set; }
        public string Code { get; set; }
        public string Title { get; set; }
        public virtual ICollection<CsmsEventDevice> EventDevices { get; set; }
    }
}
