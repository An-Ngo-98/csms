using PromotionsApi.Business.Event.ViewModels;
using PromotionsApi.Common.Paging;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetListEvents
{
    public interface IGetListEventsQuery
    {
        Task<PagedList<EventViewModel>> ExecuteAsync(int page, int pageSize, int searchBy, string startDate, string endDate, string searchString);
    }
}