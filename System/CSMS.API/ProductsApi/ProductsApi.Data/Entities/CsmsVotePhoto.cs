namespace ProductsApi.Data.Entities
{
    public partial class CsmsVotePhoto
    {
        public int Id { get; set; }
        public int VoteId { get; set; }
        public int PhotoId { get; set; }

        public virtual CsmsVote Vote { get; set; }
    }
}
