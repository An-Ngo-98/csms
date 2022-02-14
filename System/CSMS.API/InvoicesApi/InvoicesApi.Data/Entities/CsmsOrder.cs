using System;
using System.Collections.Generic;

namespace InvoicesApi.Data.Entities
{
    public partial class CsmsOrder
    {
        public CsmsOrder()
        {
            OrderDetails = new HashSet<CsmsOrderDetail>();
        }

        public string Id { get; set; }
        public int UserId { get; set; }
        public string Fullname { get; set; }
        public string Receiver { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string NoteToChef { get; set; }
        public decimal MerchandiseSubtotal { get; set; }
        public decimal ShippingFee { get; set; }
        public string ShippingService { get; set; }
        public int StoreId { get; set; }
        public string StoreCode { get; set; }
        public string StoreName { get; set; }
        public decimal Distance { get; set; }
        public string ShippingNote { get; set; }
        public int? VoucherId { get; set; }
        public string VoucherCode { get; set; }
        public int? DiscountPercent { get; set; }
        public int UsedCoins { get; set; } = 0;
        public decimal DiscountShippingFee { get; set; } = 0;
        public decimal? DiscountVoucherApplied { get; set; }
        public bool IsFreeShipVoucher { get; set; } = false;
        public decimal Total { get; set; }
        public int EarnedCoins { get; set; } = 0;
        public DateTime OrderedTime { get; set; } = DateTime.Now;
        public DateTime? CookedTime { get; set; }
        public DateTime? ShippedTime { get; set; }
        public DateTime? CompletedTime { get; set; }
        public DateTime? CanceledTime { get; set; }

        public virtual ICollection<CsmsOrderDetail> OrderDetails { get; set; }
    }
}
