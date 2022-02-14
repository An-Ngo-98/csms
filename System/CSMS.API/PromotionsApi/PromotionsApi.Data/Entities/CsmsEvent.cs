using System;
using System.Collections.Generic;

namespace PromotionsApi.Data.Entities
{
    public partial class CsmsEvent
    {
        public CsmsEvent()
        {
            ProductIds = new HashSet<CsmsEventProduct>();
            CategoryIds = new HashSet<CsmsEventCategory>();
            EventDevices = new HashSet<CsmsEventDevice>();
        }

        public int Id { get; set; }
        public string Code { get; set; }
        public DateTime StartTime { get; set; } = DateTime.Now;
        public DateTime? EndTime { get; set; }
        public TimeSpan? StartTimeInDate { get; set; }
        public TimeSpan? EndTimeInDate { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int EventTypeId { get; set; }
        public Int16? DiscountPercent { get; set; }
        public int? MaxDiscount { get; set; }
        public int? MinTotalInvoice { get; set; }
        public int? AccountLimit { get; set; }
        public int? QuantityLimit { get; set; }
        public bool AppliedAllProducts { get; set; } = false;
        public bool Enabled { get; set; } = true;

        public virtual CsmsEventType EventType { get; set; }
        public virtual ICollection<CsmsEventProduct> ProductIds { get; set; }
        public virtual ICollection<CsmsEventCategory> CategoryIds { get; set; }
        public virtual ICollection<CsmsEventDevice> EventDevices { get; set; }
    }
}
