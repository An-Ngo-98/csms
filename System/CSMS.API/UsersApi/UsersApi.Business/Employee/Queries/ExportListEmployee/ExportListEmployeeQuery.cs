using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Employee.Helpers;
using UsersApi.Business.Employee.Queries.GetListEmployee;
using UsersApi.Business.Employee.ViewModels;
using UsersApi.Common.Enum;
using UsersApi.Common.Extensions;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Employee.Queries.ExportListEmployee
{
    public class ExportListEmployeeQuery : IExportListEmployeeQuery
    {
        private const string PathFileRoot = "wwwroot/excel-template/employee/";
        private const string ExcelFileExtension = ".xlsx";
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IRepository<CsmsUser> _userRepository;
        private readonly IGetListEmployeeQuery _getListEmployeeQuery;

        public ExportListEmployeeQuery(
            IWebHostEnvironment webHostEnvironment,
            IRepository<CsmsUser> userRepository,
            IGetListEmployeeQuery getListEmployeeQuery)
        {
            _webHostEnvironment = webHostEnvironment;
            _userRepository = userRepository;
            _getListEmployeeQuery = getListEmployeeQuery;
        }

        public async Task<byte[]> ExecuteAsync(int exportType = 0, string listEmployeeId = "", string search = "")
        {
            try
            {
                byte[] result;
                int[] listEmployeeIds;
                List<ListEmployeeViewModel> listEmployeeQuery = new List<ListEmployeeViewModel>();

                switch (exportType)
                {
                    case (int)ExportType.SelectedItems:
                        listEmployeeIds = listEmployeeId != null ? listEmployeeId.Split(',').Select(int.Parse).ToArray() : new int[0];
                        listEmployeeQuery = await GetSelectedEmployee(listEmployeeIds);
                        break;
                    case (int)ExportType.SearchResult:
                        string[] searchCondition = search != null ? search.Split(';') : new string[0];
                        int sortField = int.Parse(searchCondition[0]);
                        int sortType = int.Parse(searchCondition[1]);
                        int branchId;
                        int.TryParse(searchCondition[2], out branchId);
                        int? status = searchCondition[3].TryConvertToInt();
                        int? searchBy = searchCondition[4].TryConvertToInt();
                        var data = await _getListEmployeeQuery.ExecuteAsync(0, 0, sortField, sortType,
                            branchId, status, searchBy, searchCondition[5], searchCondition[6], searchCondition[7]);
                        listEmployeeQuery = data.Items.ToList();
                        break;
                }

                result = ExportEmployeeList(listEmployeeQuery);
                return result;
            }
            catch (Exception)
            {
                //Logging<ExportListEmployeeQuery>.Error(ex, "Data: " + JsonConvert.SerializeObject(employeeIds + exportType + search));
                return new byte[0];
            }
        }

        private byte[] ExportEmployeeList(List<ListEmployeeViewModel> listEmployee)
        {
            int rowIndex = 7;

            var filePath = PathFileRoot + ExportEmployeeFile.EmployeeList + ExcelFileExtension;
            var fileInfo = _webHostEnvironment.ContentRootFileProvider.GetFileInfo(filePath);
            var template = fileInfo.CreateReadStream();
            using (var excelPackage = new ExcelPackage(template))
            {
                ExcelWorksheet workSheet = excelPackage.Workbook.Worksheets[0];
                workSheet.Cells["B2"].Value = listEmployee.Count;
                workSheet.Cells["E2"].Value = DateTime.Now.Date;
                listEmployee.ForEach(item =>
                {
                    int columnIndex = 0;

                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.EmployeeCode;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.FirstName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.LastName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.MiddleName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.FullName;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.Role;
                    workSheet.Cells[rowIndex, ++columnIndex].Value = item.BranchId;
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
                });

                return excelPackage.GetAsByteArray();
            }
        }

        private async Task<List<ListEmployeeViewModel>> GetSelectedEmployee(int[] listEmployeeId)
        {

            var data = await _userRepository.TableNoTracking
                .Where(x => listEmployeeId.Contains(x.Id))
                .Include(n => n.Status)
                .Include(n => n.UserStatusLogs)
                .Include(n => n.Addresses)
                .Include(n => n.Role)
                .ToListAsync();

            var result = data.Select(n => new ListEmployeeViewModel()
            {
                EmployeeId = n.Id,
                EmployeeCode = n.UserCode,
                FirstName = n.FirstName,
                MiddleName = n.MiddleName,
                LastName = n.LastName,
                Birthday = n.Birthday,
                CitizenId = n.CitizenID,
                Email = n.Email,
                Gender = n.Gender,
                Username = n.Username,
                PhoneNumber = n.PhoneNumber,
                BranchId = n.BranchId,
                StatusId = n.StatusId,
                Status = n.Status.Status,
                ModifiedStatusDate = n.UserStatusLogs.Last().ModifiedDate,
                Role = n.Role == null ? null : n.Role.Title,
                Address = n.Addresses.Count == 0 ? null : n.Addresses.First().District + ", " + n.Addresses.First().Province,
                FullName = n.FirstName + (n.MiddleName.IsEmpty() ? " " : " " + n.MiddleName + " ") + n.LastName
            }).ToList();

            return result;
        }
    }
}
