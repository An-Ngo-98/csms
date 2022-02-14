using InvoicesApi.Data.Entities;
using System;
using System.Collections.Generic;

namespace InvoicesApi.Business.Order.ViewModels
{
    public class TodayOrderViewModel
    {
        public TodayOrderViewModel()
        {
            this.Items = new List<CsmsOrder>();
        }

        public int TotalPending { get; set; }
        public int TotalShipping { get; set; }
        public int TotalCooking { get; set; }
        public int TotalCompleted { get; set; }
        public int TotalCanceled { get; set; }

        public int OrderStatusSelected { get; set; }
        public int[] StoreIdsSelected { get; set; }
        public DateTime TimeNow { get; set; }

        public List<CsmsOrder> Items { get; set; }
    }
}
