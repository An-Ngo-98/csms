using InvoicesApi.Business.Report.ViewModels;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Report.Queries.GetPromotionsReport
{
    public class GetPromotionsReportQuery : IGetPromotionsReportQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetPromotionsReportQuery(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<List<VoucherReportViewModel>> ExecuteAsync(string voucherIds)
        {
            try
            {
                List<VoucherReportViewModel> result = new List<VoucherReportViewModel>();
                int[] listVoucherIds = !string.IsNullOrEmpty(voucherIds) ? voucherIds.Split(',').Select(int.Parse).ToArray() : new int[0];

                var orders = await _orderRepository.TableNoTracking
                    .Where(n => listVoucherIds.Contains(n.VoucherId ?? -1))
                    .Include(n => n.OrderDetails)
                    .ToListAsync();

                foreach (var voucherId in listVoucherIds)
                {
                    result.Add(new VoucherReportViewModel()
                    {
                        VoucherId = voucherId,
                        TotalUsed = orders.Where(n => voucherId == n.VoucherId).Count(),
                        Revenue = orders.Where(n => voucherId == n.VoucherId).Sum(n => n.Total),
                        TotalDiscount = orders.Where(n => voucherId == n.VoucherId).Sum(n => n.DiscountVoucherApplied ?? 0),
                        TotalSoldProducts = orders.Where(n => voucherId == n.VoucherId).SelectMany(n => n.OrderDetails).Sum(n => n.Quantity)
                    });
                }

                return result;
            }
            catch (Exception)
            {
                return new List<VoucherReportViewModel>();
            }
        }
    }
}
