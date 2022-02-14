using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Review.ViewModels;
using ProductsApi.Common.Paging;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductsApi.Business.Review.Queries.GetListReviewByProductId
{
    public class GetListReviewByProductIdQuery : IGetListReviewByProductIdQuery
    {
        private readonly IRepository<CsmsVote> _voteRepository;

        public GetListReviewByProductIdQuery(IRepository<CsmsVote> voteRepository)
        {
            _voteRepository = voteRepository;
        }

        public async Task<PagedList<ReviewViewModel>> ExecuteAsync(int productId, int page, int pageSize, int filterType)
        {
            try
            {
                var data = await GetDataAsync(productId, filterType);
                var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
                List<ReviewViewModel> list = new List<ReviewViewModel>();

                int total = 0;
                total = data.Count();
                list = result.ToList();

                return new PagedList<ReviewViewModel>(list, page, pageSize, total);
            }
            catch (Exception)
            {
                return new PagedList<ReviewViewModel>(new List<ReviewViewModel>(), 1, 1, 0);
            }
        }

        private async Task<IEnumerable<ReviewViewModel>> GetDataAsync(int productId, int filterType)
        {
            var result = await _voteRepository.TableNoTracking
                .Where(n => n.ProductId == productId &&
                (filterType == (int)FilterType.All
                ? true
                : (filterType == (int)FilterType.HasPhoto
                    ? n.Photos.Count > 0
                    : (filterType == (int)FilterType.Purchased
                        ? n.InvoiceId != null
                        : n.Score == filterType))))
                .OrderByDescending(n => n.VotedDate)
                .Select(n => new ReviewViewModel()
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    Title = n.Title,
                    Score = n.Score,
                    VotedDate = n.VotedDate,
                    Comment = n.Comment,
                    Purchased = n.InvoiceId != null,
                    Fullname = n.Fullname,
                    Photos = n.Photos.Select(p => p.PhotoId).ToList()
                }).ToListAsync();

            return result;
        }
    }

    enum FilterType
    {
        All = 0,
        OneStar = 1,
        TwoStar = 2,
        ThreeStar = 3,
        FourStar = 4,
        FiveStar = 5,
        HasPhoto = 6,
        Purchased = 7
    }
}
