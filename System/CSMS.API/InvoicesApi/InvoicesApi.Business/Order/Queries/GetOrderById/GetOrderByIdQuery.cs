using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.GetOrderById
{
    public class GetOrderByIdQuery : IGetOrderByIdQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetOrderByIdQuery(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<CsmsOrder> ExecuteAsync(string orderId)
        {
            var result = await _orderRepository.TableNoTracking
                .Where(n => n.Id == orderId)
                .Include(n => n.OrderDetails)
                .SingleOrDefaultAsync();

            return result;
        }
    }
}
