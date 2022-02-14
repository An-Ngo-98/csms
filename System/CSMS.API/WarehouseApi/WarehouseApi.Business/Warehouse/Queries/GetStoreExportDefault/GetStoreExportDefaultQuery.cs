using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Warehouse.Queries.GetStoreExportDefault
{
    public class GetStoreExportDefaultQuery : IGetStoreExportDefaultQuery
    {
        private readonly IRepository<CsmsStoreExportDefault> _storeExportDefaultRepository;

        public GetStoreExportDefaultQuery(IRepository<CsmsStoreExportDefault> storeExportDefaultRepository)
        {
            _storeExportDefaultRepository = storeExportDefaultRepository;
        }

        public async Task<List<CsmsStoreExportDefault>> ExecuteAsync()
        {
            var result = await _storeExportDefaultRepository.TableNoTracking.ToListAsync();
            return result;
        }
    }
}
