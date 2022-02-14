using System;
using System.Collections.Generic;

namespace ProductsApi.Data.Entities
{
    public partial class CsmsVote
    {
        public CsmsVote()
        {
            Photos = new HashSet<CsmsVotePhoto>();
        }

        public int Id { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string Fullname { get; set; }
        public decimal Score { get; set; }
        public string Title { get; set; }
        public string Comment { get; set; }
        public DateTime VotedDate { get; set; }
        public string InvoiceId { get; set; }

        public virtual CsmsProduct Product { get; set; }

        public virtual ICollection<CsmsVotePhoto> Photos { get; set; }
    }
}
