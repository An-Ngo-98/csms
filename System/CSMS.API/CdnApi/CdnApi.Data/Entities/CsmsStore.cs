namespace CdnApi.Data.Entities
{
    public partial class CsmsStore
    {
        public int StoreId { get; set; }
        public string PhotoSize { get; set; }
        public string PhotoName { get; set; }
        public byte[] Photo { get; set; }
        public string PhotoType { get; set; }
        public bool Status { get; set; } = true;
    }
}
