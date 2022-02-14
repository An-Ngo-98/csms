using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Data.Entities;

namespace WarehouseApi.Business.Warehouse.Queries.GetStoreExportDefault
{
    public interface IGetStoreExportDefaultQuery
    {
        Task<List<CsmsStoreExportDefault>> ExecuteAsync();
    }
}