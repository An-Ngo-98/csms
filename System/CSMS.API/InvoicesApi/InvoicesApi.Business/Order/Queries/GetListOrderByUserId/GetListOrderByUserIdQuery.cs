using InvoicesApi.Business.Order.ViewModels;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.GetListOrderByUserId
{
    public class GetListOrderByUserIdQuery : IGetListOrderByUserIdQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetListOrderByUserIdQuery(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<List<OrderByUserIdViewModel>> ExecuteAsync(int userId)
        {
            var result = await _orderRepository.TableNoTracking
                .Where(n => n.UserId == userId)
                .Select(n => new OrderByUserIdViewModel()
                {
                    Id = n.Id,
                    StoreName = n.StoreName,
                    Total = n.Total,
                    OrderedTime = n.OrderedTime,
                    CookedTime = n.CookedTime,
                    ShippedTime = n.ShippedTime,
                    CompletedTime = n.CompletedTime,
                    CanceledTime = n.CanceledTime,
                    Products = n.OrderDetails.Select(x => new ProductViewModel()
                    {
                        Id = x.ProductId,
                        Name = x.ProductName,
                        CategoryName = x.CategoryName,
                        Price = x.Price,
                        OriginalPrice = x.OriginalPrice,
                        Quantity = x.Quantity,
                        PhotoId = x.PhotoId
                    }).ToList()
                })
                .ToListAsync();

            return result;
        }
    }
}
