using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SystemApi.Data.Entities;
using SystemApi.Data.Services;

namespace SystemApi.Business.Branch.Queries.GetEnableProvince
{
    public class GetEnableProvinceQuery : IGetEnableProvinceQuery
    {
        private readonly IRepository<CsmsBranch> _branchRepository;

        public GetEnableProvinceQuery(IRepository<CsmsBranch> branchRepository)
        {
            _branchRepository = branchRepository;
        }

        public async Task<List<string>> ExecuteAsync()
        {
            var result = await _branchRepository.TableNoTracking
            .Where(x => x.Enabled == true && x.Deleted == false)
            .Select(x => x.Add_Province)
            .Distinct()
            .ToListAsync();

            return result;
        }
    }
}
