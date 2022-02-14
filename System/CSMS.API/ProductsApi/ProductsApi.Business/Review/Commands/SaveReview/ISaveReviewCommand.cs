using ProductsApi.Common.Commands;
using ProductsApi.Data.Entities;
using System.Threading.Tasks;

namespace ProductsApi.Business.Review.Commands.SaveReview
{
    public interface ISaveReviewCommand
    {
        Task<CommandResult> ExecuteAsync(CsmsVote model);
    }
}