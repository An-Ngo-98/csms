using System.Collections.Generic;
using System.Threading.Tasks;
using SystemApi.Business.Branch.ViewModels;

namespace SystemApi.Business.Branch.Queries.GetEnableBranch
{
    public interface IGetEnableBranchQuery
    {
        Task<List<EnableBranchViewModel>> ExecuteAsync();
    }
}