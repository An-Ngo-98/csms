using System;
using System.Collections.Generic;

namespace InvoicesApi.Business.Order.ViewModels
{
    public class OrderByUserIdViewModel
    {
        public OrderByUserIdViewModel()
        {
            Products = new List<ProductViewModel>();
        }

        public string Id { get; set; }
        public string StoreName { get; set; }
        public decimal Total { get; set; }
        public DateTime OrderedTime { get; set; }
        public DateTime? CookedTime { get; set; }
        public DateTime? ShippedTime { get; set; }
        public DateTime? CompletedTime { get; set; }
        public DateTime? CanceledTime { get; set; }

        public List<ProductViewModel> Products { get; set; }
    }

    public class ProductViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CategoryName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int PhotoId { get; set; }
    }
}
