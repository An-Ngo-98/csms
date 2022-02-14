namespace CdnApi.Business.User.ViewModels
{
    public class UserAvatarViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public byte[] Content { get; set; }
        public string FileType { get; set; }
        public string FileSize { get; set; }
        public string Filename { get; set; }
    }
}
