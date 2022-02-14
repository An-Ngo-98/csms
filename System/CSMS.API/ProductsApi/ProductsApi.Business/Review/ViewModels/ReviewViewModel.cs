using System;
using System.Collections.Generic;
using System.Text;

namespace ProductsApi.Business.Review.ViewModels
{
    public class ReviewViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Fullname { get; set; }
        public decimal Score { get; set; }
        public string Title { get; set; }
        public string Comment { get; set; }
        public DateTime VotedDate { get; set; }
        public bool Purchased { get; set; }

        public List<int> Photos { get; set; }
    }
}
