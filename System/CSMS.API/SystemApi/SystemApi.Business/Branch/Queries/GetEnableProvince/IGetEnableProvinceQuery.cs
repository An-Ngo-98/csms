using System.Collections.Generic;
using System.Threading.Tasks;

namespace SystemApi.Business.Branch.Queries.GetEnableProvince
{
    public interface IGetEnableProvinceQuery
    {
        Task<List<string>> ExecuteAsync();
    }
}