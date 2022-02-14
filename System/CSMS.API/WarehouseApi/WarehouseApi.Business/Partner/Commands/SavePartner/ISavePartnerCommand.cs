using System.Threading.Tasks;
using WarehouseApi.Business.Partner.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Business.Partner.Commands.SavePartner
{
    public interface ISavePartnerCommand
    {
        Task<CommandResult> ExecuteAsync(PartnerViewModel model);
    }
}