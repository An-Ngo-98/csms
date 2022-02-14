using System.Collections.Generic;

namespace ProductsApi.Business.Product.ViewModels
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? AvatarId { get; set; }
        public string Price { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public decimal? Rate { get; set; }
        public string SearchString { get; set; }
        public int TotalVote { get; set; }
        public bool Enabled { get; set; }

        public List<PhotoViewModel> Photos { get; set; }
    }

    public class PhotoViewModel
    {
        public int Id { get; set; }
        public int PhotoId { get; set; }
    }
}
