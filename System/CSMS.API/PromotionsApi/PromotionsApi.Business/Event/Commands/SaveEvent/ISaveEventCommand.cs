using PromotionsApi.Business.Event.ViewModels;
using PromotionsApi.Common.Commands;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Commands.SaveEvent
{
    public interface ISaveEventCommand
    {
        Task<CommandResult> ExecuteAsync(GetEventViewModel model);
    }
}