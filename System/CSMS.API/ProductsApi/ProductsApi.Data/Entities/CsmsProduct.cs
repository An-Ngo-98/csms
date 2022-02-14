using System.Collections.Generic;

namespace ProductsApi.Data.Entities
{
    public partial class CsmsProduct
    {
        public CsmsProduct()
        {
            Votes = new HashSet<CsmsVote>();
            BranchProducts = new HashSet<CsmsBranchProduct>();
            Photos = new HashSet<CsmsProductPhoto>();
        }

        public int Id { get; set; }
        public int? CategoryId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? AvatarId { get; set; }
        public string Price { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public decimal? Rate { get; set; }
        public string SearchString { get; set; }
        public bool Enabled { get; set; } = true;
        public bool Deleted { get; set; }

        public virtual CsmsCategory Category { get; set; }

        public virtual ICollection<CsmsVote> Votes { get; set; }
        public virtual ICollection<CsmsProductPhoto> Photos { get; set; }
        public virtual ICollection<CsmsBranchProduct> BranchProducts { get; set; }
    }
}
