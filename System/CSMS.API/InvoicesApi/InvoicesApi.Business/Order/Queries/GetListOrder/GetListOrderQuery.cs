using InvoicesApi.Common.Enums;
using InvoicesApi.Common.Extentions;
using InvoicesApi.Common.Paging;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.GetListOrder
{
    public class GetListOrderQuery : IGetListOrderQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetListOrderQuery(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<PagedList<CsmsOrder>> ExecuteAsync(int page, int pageSize, int? statusCode, int? voucherId, DateTime? startTime, DateTime? endTime, string searchString, int[] storeIds = null)
        {
            try
            {
                var data = await GetDataAsync(statusCode, voucherId, startTime, endTime, searchString, storeIds);

                var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
                List<CsmsOrder> list = new List<CsmsOrder>();

                int total = 0;
                list = result.ToList();

                total = data.Count();
                return new PagedList<CsmsOrder>(list, page, pageSize, total);
            }
            catch (Exception)
            {
                return new PagedList<CsmsOrder>(new List<CsmsOrder>(), 1, 1, 0);
            }
        }

        private async Task<IEnumerable<CsmsOrder>> GetDataAsync(int? statusCode, int? voucherId, DateTime? startTime, DateTime? endTime, string searchString, int[] storeIds)
        {
            var data = await _orderRepository.TableNoTracking
                .Where(n =>
                    (startTime.HasValue ? n.OrderedTime >= startTime : true) &&
                    (endTime.HasValue ? n.OrderedTime <= endTime : true) &&
                    (voucherId.HasValue ? n.VoucherId == voucherId : true) &&
                    (!searchString.IsEmpty() ? n.Id == searchString : true) &&
                    (storeIds != null ? storeIds.Contains(n.StoreId) : true))
                .Include(n => n.OrderDetails)
                .OrderByDescending(n => n.OrderedTime)
                .ToListAsync();

            return FilterData(data, statusCode);
        }

        private IEnumerable<CsmsOrder> FilterData(List<CsmsOrder> data, int? statusCode)
        {
            IEnumerable<CsmsOrder> query = data;

            if (statusCode.HasValue)
            {
                switch (statusCode)
                {
                    case (int)OrderStatus.Pending:
                        query = query.Where(x =>
                            (x.CookedTime == null) &&
                            (x.ShippedTime == null) &&
                            (x.CompletedTime == null) &&
                            (x.CanceledTime == null));
                        break;

                    case (int)OrderStatus.Cooking:
                        query = query.Where(x =>
                            (x.CookedTime != null) &&
                            (x.ShippedTime == null) &&
                            (x.CompletedTime == null) &&
                            (x.CanceledTime == null));
                        break;

                    case (int)OrderStatus.Shipping:
                        query = query.Where(x =>
                            (x.CookedTime != null) &&
                            (x.ShippedTime != null) &&
                            (x.CompletedTime == null) &&
                            (x.CanceledTime == null));
                        break;

                    case (int)OrderStatus.Completed:
                        query = query.Where(x => x.CompletedTime != null);
                        break;

                    case (int)OrderStatus.Canceled:
                        query = query.Where(x => x.CanceledTime != null);
                        break;
                }
            }

            return query;
        }
    }
}
