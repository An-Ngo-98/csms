using System;
using System.Collections.Generic;

namespace PromotionsApi.Business.Event.ViewModels
{
    public class AvailableEventViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public TimeSpan? StartTimeInDate { get; set; }
        public TimeSpan? EndTimeInDate { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string EventTypeCode { get; set; }
        public Int16? DiscountPercent { get; set; }
        public int? MaxDiscount { get; set; }
        public int? MinTotalInvoice { get; set; }
        public int? AccountLimit { get; set; }
        public int? QuantityLimit { get; set; }
        public bool AppliedAllProducts { get; set; }
        public List<int> ProductIds { get; set; }
        public List<int> CategoryIds { get; set; }
        public List<string> Devices { get; set; }
    }
}
