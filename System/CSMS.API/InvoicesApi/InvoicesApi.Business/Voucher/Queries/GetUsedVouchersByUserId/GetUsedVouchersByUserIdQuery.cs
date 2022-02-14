using InvoicesApi.Business.Voucher.ViewModels;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Voucher.Queries.GetUsedVouchersByUserId
{
    public class GetUsedVouchersByUserIdQuery : IGetUsedVouchersByUserIdQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetUsedVouchersByUserIdQuery(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<List<UsedVoucherViewModel>> ExecuteAsync(int userId)
        {
            var result = await _orderRepository.TableNoTracking
                .Where(n => n.UserId == userId && n.VoucherId != null)
                .GroupBy(n => n.VoucherId)
                .Select(n => new UsedVoucherViewModel()
                {
                    VoucherId = n.Key,
                    Quantity = n.Count()
                })
                .ToListAsync();

            return result;
        }
    }
}
