using System;
using System.Collections.Generic;

namespace ProductsApi.Business.Review.ViewModels
{
    public class ReviewByUserIdViewModel
    {
        public string Fullname { get; set; }
        public decimal Score { get; set; }
        public string Title { get; set; }
        public string Comment { get; set; }
        public DateTime VotedDate { get; set; }
        public string InvoiceId { get; set; }
        public int ProductId { get; set; }
        public int ProductPhotoId { get; set; }
        public string ProductName { get; set; }

        public List<int> Photos { get; set; }
    }
}
