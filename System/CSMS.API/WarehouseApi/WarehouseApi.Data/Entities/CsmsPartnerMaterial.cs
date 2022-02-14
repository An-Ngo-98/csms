namespace WarehouseApi.Data.Entities
{
    public partial class CsmsPartnerMaterial
    {
        public int Id { get; set; }
        public int PartnerId { get; set; }
        public int MaterialId { get; set; }
        public decimal Price { get; set; }
        public int? MaxUnit { get; set; }

        public virtual CsmsMaterial Material { get; set; }
        public virtual CsmsPartner Partner { get; set; }
    }
}
