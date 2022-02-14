using System.Threading.Tasks;
using SystemApi.Business.Branch.ViewModels;
using SystemApi.Common.Commands;

namespace SystemApi.Business.Branch.Commands.SaveBranch
{
    public interface ISaveBranchCommand
    {
        Task<CommandResult> ExecuteAsync(BranchViewModel model);
    }
}