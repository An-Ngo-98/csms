using InvoicesApi.Business.Report.Queries.GetBestSellingProducts;
using InvoicesApi.Business.Report.Queries.GetPromotionsReport;
using InvoicesApi.Business.Report.Queries.GetRevenueByCategory;
using InvoicesApi.Business.Report.Queries.GetRevenueByStore;
using InvoicesApi.Business.Report.Queries.GetRevenueOverview;
using InvoicesApi.Common.Extentions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InvoicesApi.Report
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IGetRevenueOverviewQuery _getRevenueOverviewQuery;
        private readonly IGetRevenueByStoreQuery _getRevenueByStoreQuery;
        private readonly IGetRevenueByCategoryQuery _getRevenueByCategoryQuery;
        private readonly IGetBestSellingProductsQuery _getBestSellingProductsQuery;
        private readonly IGetPromotionsReportQuery _getPromotionsReportQuery;

        public ReportsController(
            IGetRevenueOverviewQuery getRevenueOverviewQuery,
            IGetRevenueByStoreQuery getRevenueByStoreQuery,
            IGetRevenueByCategoryQuery getRevenueByCategoryQuery,
            IGetBestSellingProductsQuery getBestSellingProductsQuery,
            IGetPromotionsReportQuery getPromotionsReportQuery)
        {
            _getRevenueOverviewQuery = getRevenueOverviewQuery;
            _getRevenueByStoreQuery = getRevenueByStoreQuery;
            _getRevenueByCategoryQuery = getRevenueByCategoryQuery;
            _getBestSellingProductsQuery = getBestSellingProductsQuery;
            _getPromotionsReportQuery = getPromotionsReportQuery;
        }

        [HttpGet("revenue-overview")]
        public async Task<IActionResult> GetRevenueOverviewAsync(DateTime? startTime, DateTime? endTime)
        {
            DateTime now = DateTime.Now;
            DateTime startTemp = (startTime ?? now.AddDays(-8)).ChangeTime(0, 0, 0, 0);
            DateTime endTemp = (endTime ?? now.AddDays(-1)).ChangeTime(23, 59, 59, 999);
            var result = await _getRevenueOverviewQuery.ExecuteAsync(startTemp, endTemp);

            return new ObjectResult(result);
        }

        [HttpGet("revenue-store")]
        public async Task<IActionResult> GetRevenueByStoreAsync(DateTime? startTime, DateTime? endTime)
        {
            DateTime now = DateTime.Now;
            DateTime startTemp = (startTime ?? now.AddDays(-8)).ChangeTime(0, 0, 0, 0);
            DateTime endTemp = (endTime ?? now.AddDays(-1)).ChangeTime(23, 59, 59, 999);
            var result = await _getRevenueByStoreQuery.ExecuteAsync(startTemp, endTemp);

            return new ObjectResult(result);
        }

        [HttpGet("revenue-category")]
        public async Task<IActionResult> GetRevenueByCategoryAsync(DateTime? startTime, DateTime? endTime)
        {
            DateTime now = DateTime.Now;
            DateTime startTemp = (startTime ?? now.AddDays(-8)).ChangeTime(0, 0, 0, 0);
            DateTime endTemp = (endTime ?? now.AddDays(-1)).ChangeTime(23, 59, 59, 999);
            var result = await _getRevenueByCategoryQuery.ExecuteAsync(startTemp, endTemp);

            return new ObjectResult(result);
        }

        [HttpGet("best-selling-products")]
        public async Task<IActionResult> GetBestSellingProductsAsync(DateTime? startTime, DateTime? endTime)
        {
            DateTime now = DateTime.Now;
            DateTime startTemp = startTime ?? now.AddDays(-8).ChangeTime(0, 0, 0, 0);
            DateTime endTemp = endTime ?? now.AddDays(-1).ChangeTime(23, 59, 59, 999);
            var result = await _getBestSellingProductsQuery.ExecuteAsync(startTemp, endTemp);

            return new ObjectResult(result);
        }

        [HttpGet("promotions")]
        public async Task<IActionResult> GetPromotionsReportAsync(string voucherIds)
        {
            var result = await _getPromotionsReportQuery.ExecuteAsync(voucherIds);
            return new ObjectResult(result);
        }
    }
}