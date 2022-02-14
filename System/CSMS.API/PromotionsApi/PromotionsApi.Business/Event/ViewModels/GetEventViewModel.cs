using System;
using System.Collections.Generic;

namespace PromotionsApi.Business.Event.ViewModels
{
    public class GetEventViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public DateTime StartTime { get; set; }
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
        public bool AppliedAllProducts { get; set; }
        public bool Enabled { get; set; }
        public virtual List<int> ProductIds { get; set; }
        public virtual List<int> CategoryIds { get; set; }
        public virtual List<int> DeviceIds { get; set; }
    }
}
