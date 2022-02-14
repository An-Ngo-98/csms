using PromotionsApi.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetDevices
{
    public interface IGetDevicesQuery
    {
        Task<List<CsmsDevice>> ExecuteAsync();
    }
}