using System.Threading.Tasks;
using SystemApi.Common.Commands;

namespace SystemApi.Business.Branch.Commands.DeleteBranch
{
    public interface IDeleteBranchCommand
    {
        Task<CommandResult> ExecuteAsync(int branchId);
    }
}