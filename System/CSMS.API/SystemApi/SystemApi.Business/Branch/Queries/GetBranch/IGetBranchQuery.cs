using System.Threading.Tasks;
using SystemApi.Business.Branch.ViewModels;
using SystemApi.Common.Paging;

namespace SystemApi.Business.Branch.Queries.GetBranch
{
    public interface IGetBranchQuery
    {
        Task<PagedList<BranchViewModel>> ExecuteAsync(int page, int pageSize);
    }
}