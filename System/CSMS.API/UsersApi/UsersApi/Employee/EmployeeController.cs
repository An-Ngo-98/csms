using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UsersApi.Business.Employee.Queries.GetListEmployee;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;
using UsersApi.Common.Commands;
using UsersApi.Constants;
using UsersApi.Business.Employee.Queries.ExportListEmployee;
using UsersApi.Business.Employee.Queries.GetSalaryByMonth;

namespace UsersApi.Employee
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IGetListEmployeeQuery _getListEmployeeQuery;
        private readonly IExportListEmployeeQuery _exportListEmployeeQuery;
        private readonly IGetSalaryByMonthQuery _getSalaryByMonthQuery;

        public EmployeeController(
            IGetListEmployeeQuery getListEmployeeQuery,
            IExportListEmployeeQuery exportListEmployeeQuery,
            IGetSalaryByMonthQuery getSalaryByMonthQuery)
        {
            _getListEmployeeQuery = getListEmployeeQuery;
            _exportListEmployeeQuery = exportListEmployeeQuery;
            _getSalaryByMonthQuery = getSalaryByMonthQuery;
        }

        [HttpGet("GetListEmployee/{page:int=1}/{pageSize:int=10}/{sortField:int=1}/{sortType:int=1}")]
        public async Task<IActionResult> GetListEmployeeAsync(int page, int pageSize, int sortField, int sortType, int? branchId, int? employeeStatus, int? searchBy, string startDate, string endDate, string searchString)
        {
            var result = await _getListEmployeeQuery.ExecuteAsync(page, pageSize, sortField, sortType, branchId, employeeStatus, searchBy, startDate, endDate, searchString);
            return new ObjectResult(result);
        }

        [HttpGet("GetSalaryByMonth")]
        public async Task<IActionResult> GetSalaryByMonthAsync(int? branchId, int month, int year)
        {
            var result = await _getSalaryByMonthQuery.ExecuteAsync(branchId, month, year);
            return new ObjectResult(result);
        }

        [HttpGet("ExportListEmployee/{exportType:int=0}")]
        public async Task<IActionResult> ExportListEmployeeAsync(int exportType, string listUserId, string searchCondition)
        {
            var result = await _exportListEmployeeQuery.ExecuteAsync(exportType, listUserId, searchCondition);
            return File(result, KnownFileType.XLSX);
        }
    }
}