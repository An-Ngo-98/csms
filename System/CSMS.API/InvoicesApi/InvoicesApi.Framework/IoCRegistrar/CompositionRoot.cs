using DryIoc;
using System;
using System.Net.Http;
using InvoicesApi.Data.Services;
using InvoicesApi.Business.Order.Commands.AddOrder;
using InvoicesApi.Business.Coin.Queries.GetCoinsByUserId;
using InvoicesApi.Business.Order.Queries.GetListOrderByUserId;
using InvoicesApi.Business.Order.Queries.GetOrderById;
using InvoicesApi.Business.Order.Commands.UpdateStatusOrder;
using InvoicesApi.Business.Voucher.Queries.GetUsedVouchersByUserId;
using InvoicesApi.Business.Coin.Queries.GetCoinHistoryByUserId;
using InvoicesApi.Business.Statistic.Queries.GetStatisticData;
using InvoicesApi.Business.User.Queries.GetNumOfNewCustomers;
using InvoicesApi.Business.Order.Queries.GetListOrder;
using InvoicesApi.Business.Report.Queries.GetRevenueOverview;
using InvoicesApi.Business.Report.Queries.GetPromotionsReport;
using InvoicesApi.Business.Report.Queries.GetBestSellingProducts;
using InvoicesApi.Business.Report.Queries.GetRevenueByCategory;
using InvoicesApi.Business.Report.Queries.GetRevenueByStore;
using InvoicesApi.Business.Order.Queries.GetTodayOrders;
using InvoicesApi.Business.Order.Queries.ExportListInvoice;

namespace InvoicesApi.Framework.IoCRegistrar
{
    public class CompositionRoot
    {
        public CompositionRoot(IRegistrator registrator)
        {
            // General
            registrator.Register<Lazy<HttpClient>>(Reuse.InWebRequest);
            registrator.Register<IDbContext, ApplicationDbContext>(Reuse.InWebRequest);
            registrator.Register(typeof(IRepository<>), typeof(EfRepository<>), Reuse.InWebRequest);

            // Order Business
            registrator.Register<IAddOrderCommand, AddOrderCommand>(Reuse.InWebRequest);
            registrator.Register<IGetListOrderByUserIdQuery, GetListOrderByUserIdQuery>(Reuse.InWebRequest);
            registrator.Register<IGetListOrderQuery, GetListOrderQuery>(Reuse.InWebRequest);
            registrator.Register<IGetTodayOrdersQuery, GetTodayOrdersQuery>(Reuse.InWebRequest);
            registrator.Register<IGetOrderByIdQuery, GetOrderByIdQuery>(Reuse.InWebRequest);
            registrator.Register<IExportListInvoiceQuery, ExportListInvoiceQuery>(Reuse.InWebRequest);
            registrator.Register<IUpdateStatusOrderCommand, UpdateStatusOrderCommand>(Reuse.InWebRequest);

            // Coin Business
            registrator.Register<IGetCoinsByUserIdQuery, GetCoinsByUserIdQuery>(Reuse.InWebRequest);
            registrator.Register<IGetCoinHistoryByUserIdQuery, GetCoinHistoryByUserIdQuery>(Reuse.InWebRequest);

            // Voucher Business
            registrator.Register<IGetUsedVouchersByUserIdQuery, GetUsedVouchersByUserIdQuery>(Reuse.InWebRequest);

            // Statistic Business
            registrator.Register<IGetStatisticDataQuery, GetStatisticDataQuery>(Reuse.InWebRequest);

            // User Business
            registrator.Register<IGetNumOfNewCustomersQuery, GetNumOfNewCustomersQuery>(Reuse.InWebRequest);

            // Report Business
            registrator.Register<IGetRevenueOverviewQuery, GetRevenueOverviewQuery>(Reuse.InWebRequest);
            registrator.Register<IGetRevenueByStoreQuery, GetRevenueByStoreQuery>(Reuse.InWebRequest);
            registrator.Register<IGetRevenueByCategoryQuery, GetRevenueByCategoryQuery>(Reuse.InWebRequest);
            registrator.Register<IGetBestSellingProductsQuery, GetBestSellingProductsQuery>(Reuse.InWebRequest);
            registrator.Register<IGetPromotionsReportQuery, GetPromotionsReportQuery>(Reuse.InWebRequest);
        }
    }
}
