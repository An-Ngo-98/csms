using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Customer.Helpers;
using UsersApi.Business.Customer.Queries.GetListCustomer;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Common.Enum;
using UsersApi.Common.Extensions;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Customer.Queries.ExportListCustomer
{
    public class ExportListCustomerQuery : IExportListCustomerQuery
    {
        private const string PathFileRoot = "wwwroot/excel-template/customer/";
        private const string ExcelFileExtension = ".xlsx";
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IRepository<CsmsUser> _userRepository;
        private readonly IGetListCustomerQuery _getListCustomerQuery;

        public ExportListCustomerQuery(
            IWebHostEnvironment webHostEnvironment,
            IRepository<CsmsUser> userRepository,
            IGetListCustomerQuery getListCustomerQuery)
        {
            _webHostEnvironment = webHostEnvironment;
            _userRepository = userRepository;
            _getListCustomerQuery = getListCustomerQuery;
        }

        public async Task<byte[]> ExecuteAsync(int exportType = 0, string listCustomerId = "", string search = "")
        {
            try
            {
                byte[] result;
                int[] listCustomerIds;
                List<ListCustomerViewModel> listCustomerQuery = new List<ListCustomerViewModel>();

                switch (exportType)
                {
                    case (int)ExportType.SelectedItems:
                        listCustomerIds = listCustomerId != null ? listCustomerId.Split(',').Select(int.Parse).ToArray() : new int[0];
                        listCustomerQuery = await GetSelectedCustomer(listCustomerIds);
                        break;
                    case (int)ExportType.SearchResult:
                        string[] searchCondition = search != null ? search.Split(';') : new string[0];
                        int sortField = int.Parse(searchCondition[0]);
                        int sortType = int.Parse(searchCondition[1]);
                        int? status = searchCondition[2].TryConvertToInt();
                        var data = await _getListCustomerQuery.ExecuteAsync(0, 0, sortField, sortType, status, searchCondition[3]);
                        listCustomerQuery = data.Items.ToList();
                        break;
                }

                result = ExportCustomerList(listCustomerQuery);
                return result;
            }
            catch (Exception)
            {
                //Logging<ExportListCustomerQuery>.Error(ex, "Data: " + JsonConvert.SerializeObject(customerIds + exportType + search));
                return new byte[0];
            }
        }

        private byte[] ExportCustomerList(List<ListCustomerViewModel> listCustomer)
        {
            int rowIndex = 7;
            int count = 1;
            var filePath = PathFileRoot + ExportCustomerFile.CustomerList + ExcelFileExtension;
            var fileInfo = _webHostEnvironment.ContentRootFileProvider.GetFileInfo(filePath);
            var template = fileInfo.CreateReadStream();
            using (var excelPackage = new ExcelPackage(template))
            {
                ExcelWorksheet workSheet = excelPackage.Workbook.Worksheets[0];
                workSheet.Cells["B2"].Value = listCustomer.Count;
                workSheet.Cells["E2"].Value = DateTime.Now.Date;
                listCustomer.ForEach(item =>
                {
                    int columnIndex = 0;

                    workSheet.Cells[rowIndex, ++columnIndex].Value = count;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.FirstName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.LastName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.MiddleName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.FullName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.CitizenId;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Birthday;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Username;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Email;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.PhoneNumber;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Gender;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Address;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Status;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.ModifiedStatusDate;
                    rowIndex++;
                    count++;
                });

                return excelPackage.GetAsByteArray();
            }
        }

        private async Task<List<ListCustomerViewModel>> GetSelectedCustomer(int[] listCustomerId)
        {

            var data = await _userRepository.TableNoTracking
                .Where(x => listCustomerId.Contains(x.Id))
                .Include(n => n.Status)
                .Include(n => n.UserStatusLogs)
                .Include(n => n.Addresses)
                .ToListAsync();

            var result = data.Select(n => new ListCustomerViewModel()
            {
                CustomerId = n.Id,
                FirstName = n.FirstName,
                MiddleName = n.MiddleName,
                LastName = n.LastName,
                Birthday = n.Birthday,
                CitizenId = n.CitizenID,
                Email = n.Email,
                Gender = n.Gender,
                Username = n.Username,
                PhoneNumber = n.PhoneNumber,
                StatusId = n.StatusId,
                Status = n.Status.Status,
                ModifiedStatusDate = n.UserStatusLogs.Last().ModifiedDate,
                Address = n.Addresses.Count == 0 ? null : n.Addresses.First().District + ", " + n.Addresses.First().Province,
                FullName = n.FirstName + (n.MiddleName.IsEmpty() ? " " : " " + n.MiddleName + " ") + n.LastName
            }).ToList();

            return result;
        }
    }
}
