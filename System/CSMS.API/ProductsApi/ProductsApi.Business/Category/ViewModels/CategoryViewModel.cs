namespace ProductsApi.Business.Category.ViewModels
{
    public class CategoryViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string[] Products { get; set; }
        public bool? Enabled { get; set; }
    }
}
