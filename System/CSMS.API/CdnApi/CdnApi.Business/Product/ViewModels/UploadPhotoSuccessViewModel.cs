namespace CdnApi.Business.Product.ViewModels
{
    public class UploadPhotoSuccessViewModel
    {
        public int ImageId { get; set; }

        public UploadPhotoSuccessViewModel(int imageId)
        {
            this.ImageId = imageId;
        }
    }
}
