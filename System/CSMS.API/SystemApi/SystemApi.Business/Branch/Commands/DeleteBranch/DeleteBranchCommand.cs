using System;
using System.Net;
using System.Threading.Tasks;
using SystemApi.Common.Commands;
using SystemApi.Constants;
using SystemApi.Data.Entities;
using SystemApi.Data.Services;

namespace SystemApi.Business.Branch.Commands.DeleteBranch
{
    public class DeleteBranchCommand : IDeleteBranchCommand
    {
        private readonly IRepository<CsmsBranch> _branchRepository;

        public DeleteBranchCommand(IRepository<CsmsBranch> branchRepository)
        {
            _branchRepository = branchRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int branchId)
        {
            try
            {
                CsmsBranch branch = await _branchRepository.GetByIdAsync(branchId);

                if (branch != null)
                {
                    branch.Deleted = true;
                    await _branchRepository.UpdateAsync(branch);

                    return CommandResult.Success;
                }

                return CommandResult.Failed(new CommandResultError
                {
                    Code = (int)HttpStatusCode.NotFound,
                    Description = MessageError.NotFound
                });
            }
            catch (Exception)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = MessageError.InternalServerError
                });
            }
        }
    }
}
