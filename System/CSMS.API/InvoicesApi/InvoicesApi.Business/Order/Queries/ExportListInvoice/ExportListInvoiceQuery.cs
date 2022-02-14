using InvoicesApi.Business.Order.Queries.GetListOrder;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using InvoicesApi.Data.Entities;
using System.Collections.Generic;
using InvoicesApi.Common.Enums;
using InvoicesApi.Data.Services;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using InvoicesApi.Common.Extentions;
using InvoicesApi.Business.Order.Helpers;
using OfficeOpenXml;

namespace InvoicesApi.Business.Order.Queries.ExportListInvoice
{
    public class ExportListInvoiceQuery : IExportListInvoiceQuery
    {
        private const string PathFileRoot = "wwwroot/excel-template/";
        private const string ExcelFileExtension = ".xlsx";
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IRepository<CsmsOrder> _orderRepository;
        private readonly IGetListOrderQuery _getListOrderQuery;

        public ExportListInvoiceQuery(
            IWebHostEnvironment webHostEnvironment,
            IRepository<CsmsOrder> orderRepository,
            IGetListOrderQuery getListOrderQuery)
        {
            _webHostEnvironment = webHostEnvironment;
            _orderRepository = orderRepository;
            _getListOrderQuery = getListOrderQuery;
        }

        public async Task<byte[]> ExecuteAsync(int exportType = 0, string listInvoiceId = "", string search = "")
        {
            try
            {
                byte[] result;
                string[] listInvoiceIds;
                List<CsmsOrder> listInvoiceQuery = new List<CsmsOrder>();

                switch (exportType)
                {
                    case (int)ExportType.SelectedItems:
                        listInvoiceIds = !string.IsNullOrEmpty(listInvoiceId) ? listInvoiceId.Split(',') : new string[0];
                        listInvoiceQuery = await GetSelectedInvoice(listInvoiceIds);
                        break;
                    case (int)ExportType.SearchResult:
                        string[] searchCondition = search != null ? search.Split(';') : new string[0];
                        int? statusSelected = searchCondition[0].TryConvertToInt();
                        int? voucherId = searchCondition[1].TryConvertToInt();
                        DateTime? startDate = searchCondition[2].TryPrase();
                        DateTime? endDate = searchCondition[3].TryPrase();

                        int[] storeIds = null;
                        if (!string.IsNullOrEmpty(searchCondition[5]))
                        {
                            storeIds = searchCondition[5].Split(',').Select(int.Parse).ToArray();
                        }

                        var data = await _getListOrderQuery.ExecuteAsync(0, 0, statusSelected, voucherId, startDate, endDate, searchCondition[4], storeIds);
                        listInvoiceQuery = data.Items.ToList();
                        break;
                }

                result = ExportInvoiceList(listInvoiceQuery);
                return result;
            }
            catch (Exception)
            {
                return new byte[0];
            }
        }

        private byte[] ExportInvoiceList(List<CsmsOrder> listOrder)
        {
            int rowIndex = 10;

            var filePath = PathFileRoot + ExportInvoiceFile.InvoiceList + ExcelFileExtension;
            var fileInfo = _webHostEnvironment.ContentRootFileProvider.GetFileInfo(filePath);
            var template = fileInfo.CreateReadStream();
            using (var excelPackage = new ExcelPackage(template))
            {
                ExcelWorksheet workSheet = excelPackage.Workbook.Worksheets[0];
                workSheet.Cells["B2"].Value = listOrder.Count;
                workSheet.Cells["E2"].Value = DateTime.Now.Date;
                workSheet.Cells["E4"].Value = listOrder.Sum(n => n.Total);
                listOrder.ForEach(item =>
                {
                    int columnIndex = 0;

                    workSheet.Cells[rowIndex, ++columnIndex].Value = rowIndex - 9;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Id;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = GetStatusOrder(item);
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.OrderedTime;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Total;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.StoreName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.CompletedTime;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.CanceledTime;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Fullname;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Receiver;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.PhoneNumber;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Distance;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Address;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.DiscountVoucherApplied.HasValue ? item.DiscountVoucherApplied : item.DiscountShippingFee;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.ShippingFee;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.MerchandiseSubtotal;
                    rowIndex++;
                });

                return excelPackage.GetAsByteArray();
            }
        }

        private async Task<List<CsmsOrder>> GetSelectedInvoice(string[] listInvoiceIds)
        {
            var result = await _orderRepository.TableNoTracking
                .Where(x => listInvoiceIds.Contains(x.Id))
                .Include(n => n.OrderDetails)
                .ToListAsync();

            return result;
        }

        private string GetStatusOrder(CsmsOrder order)
        {
            if (order.CanceledTime != null)
            {
                return "Canceled";
            }

            if (order.CookedTime == null)
            {
                return "Pending";
            }

            if (order.ShippedTime == null)
            {
                return "Cooking";
            }

            if (order.CompletedTime == null)
            {
                return "Shipping";
            }

            if (order.CompletedTime != null)
            {
                return "Completed";
            }

            return "N/A";
        }
    }
}
