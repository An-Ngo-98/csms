using System.Collections.Generic;

namespace WarehouseApi.Data.Entities
{
    public partial class CsmsSpendType
    {
        public CsmsSpendType()
        {
            SpendingHistories = new HashSet<CsmsSpendingHistory>();
        }

        public string Id { get; set; }
        public string TypeName { get; set; }

        public virtual ICollection<CsmsSpendingHistory> SpendingHistories { get; set; }
    }
}
