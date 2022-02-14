using PromotionsApi.Business.Event.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetAvailableEvents
{
    public interface IGetAvailableEventsQuery
    {
        Task<List<AvailableEventViewModel>> ExecuteAsync();
    }
}