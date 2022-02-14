using InvoicesApi.Business.Report.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Report.Queries.GetPromotionsReport
{
    public interface IGetPromotionsReportQuery
    {
        Task<List<VoucherReportViewModel>> ExecuteAsync(string voucherIds);
    }
}