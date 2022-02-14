using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.User.Queries.GetNumOfNewCustomers
{
    public class GetNumOfNewCustomersQuery : IGetNumOfNewCustomersQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetNumOfNewCustomersQuery(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<int> ExecuteAsync(DateTime startDate, DateTime endDate)
        {
            var result = await
                _orderRepository.TableNoTracking
                .Where(n =>
                    n.CompletedTime.HasValue &&
                    (n.CompletedTime ?? DateTime.Now) >= startDate &&
                    (n.CompletedTime ?? DateTime.Now) <= endDate)
                .Select(n => n.UserId)
                .Distinct()
                .Except(
                    _orderRepository.TableNoTracking
                    .Where(n =>
                        n.CompletedTime != null &&
                        (n.CompletedTime ?? DateTime.Now) < startDate)
                    .Select(n => n.UserId)
                    .Distinct()
                )
                .CountAsync();

            return result;
        }
    }
}
