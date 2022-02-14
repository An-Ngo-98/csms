using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Review.ViewModels;
using ProductsApi.Common.Extentions;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductsApi.Business.Review.Queries.GetListReviewByUserId
{
    public class GetListReviewByUserIdQuery : IGetListReviewByUserIdQuery
    {
        private readonly IRepository<CsmsVote> _voteRepository;

        public GetListReviewByUserIdQuery(IRepository<CsmsVote> voteRepository)
        {
            _voteRepository = voteRepository;
        }

        public Task<List<ReviewByUserIdViewModel>> ExecuteAsync(int userId, string orderId = null)
        {
            var result = _voteRepository.TableNoTracking
                .Where(n => 
                    (n.UserId == userId) &&
                    (orderId.IsEmpty() ? true : n.InvoiceId == orderId)
                )
                .Select(n => new ReviewByUserIdViewModel()
                {
                    InvoiceId = n.InvoiceId,
                    Fullname = n.Fullname,
                    Title = n.Title,
                    Comment = n.Comment,
                    Score = n.Score,
                    VotedDate = n.VotedDate,
                    ProductId = n.ProductId,
                    ProductName = n.Product.Name,
                    ProductPhotoId = n.Product.AvatarId ?? 0,
                    Photos = n.Photos.Select(x => x.PhotoId).ToList()
                })
                .ToListAsync();

            return result;
        }
    }
}
