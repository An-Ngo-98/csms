using InvoicesApi.Common.Paging;
using InvoicesApi.Data.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.GetListOrder
{
    public interface IGetListOrderQuery
    {
        Task<PagedList<CsmsOrder>> ExecuteAsync(int page, int pageSize, int? statusCode, int? voucherId, DateTime? startTime, DateTime? endTime, string searchString, int[] storeIds = null);
    }
}
