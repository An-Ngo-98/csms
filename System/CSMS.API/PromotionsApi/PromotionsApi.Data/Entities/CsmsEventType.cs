using System.Collections.Generic;

namespace PromotionsApi.Data.Entities
{
    public partial class CsmsEventType
    {
        public CsmsEventType()
        {
            Events = new HashSet<CsmsEvent>();
        }

        public int Id { get; set; }
        public string Code { get; set; }
        public string Title { get; set; }

        public virtual ICollection<CsmsEvent> Events { get; set; }
    }
}
