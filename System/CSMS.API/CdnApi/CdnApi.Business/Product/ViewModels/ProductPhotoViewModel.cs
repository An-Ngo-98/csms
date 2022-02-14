namespace CdnApi.Business.Product.ViewModels
{
    public class ProductPhotoViewModel
    {
        public int Id { get; set; }
        public string FileType { get; set; }
        public string FileSize { get; set; }
        public string Filename { get; set; }
        public byte[] Content { get; set; }
        public bool Enabled { get; set; }
    }
}
