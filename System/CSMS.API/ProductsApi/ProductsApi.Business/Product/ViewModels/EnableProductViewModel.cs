using System.Collections.Generic;

namespace ProductsApi.Business.Product.ViewModels
{
    public class EnableProductViewModel
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
        public int TotalRate { get; set; }
        public List<int> TotalRateDetail { get; set; }
        public List<int> Photos { get; set; }
        public List<int> AvailableBranchs { get; set; }
        public string SearchString { get; set; }
        public bool Enabled { get; set; }
    }
}
