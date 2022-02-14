using PromotionsApi.Business.Event.ViewModels;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetEventById
{
    public interface IGetEventByIdQuery
    {
        Task<GetEventViewModel> ExecuteAsync(int eventId);
    }
}