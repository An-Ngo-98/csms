using System.Collections.Generic;

namespace ProductsApi.Data.Entities
{
    public partial class CsmsCategory
    {
        public CsmsCategory()
        {
            Products = new HashSet<CsmsProduct>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool Enabled { get; set; } = true;
        public bool Deleted { get; set; }

        public virtual ICollection<CsmsProduct> Products { get; set; }
    }
}
