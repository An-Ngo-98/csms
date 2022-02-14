using Microsoft.EntityFrameworkCore;
using PromotionsApi.Data.Entities;
using PromotionsApi.Data.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetDevices
{
    public class GetDevicesQuery : IGetDevicesQuery
    {
        private readonly IRepository<CsmsDevice> _deviceRepository;

        public GetDevicesQuery(IRepository<CsmsDevice> deviceRepository)
        {
            _deviceRepository = deviceRepository;
        }

        public async Task<List<CsmsDevice>> ExecuteAsync()
        {
            var result = await _deviceRepository.TableNoTracking.ToListAsync();

            return result;
        }
    }
}
