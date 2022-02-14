using PromotionsApi.Business.Event.ViewModels;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetEventByCode
{
    public interface IGetEventByCodeQuery
    {
        Task<AvailableEventViewModel> ExecuteAsync(string code);
    }
}