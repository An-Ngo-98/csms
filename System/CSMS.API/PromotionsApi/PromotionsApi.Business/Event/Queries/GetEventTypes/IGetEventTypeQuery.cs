using PromotionsApi.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetEventTypes
{
    public interface IGetEventTypeQuery
    {
        Task<List<CsmsEventType>> ExecuteAsync();
    }
}