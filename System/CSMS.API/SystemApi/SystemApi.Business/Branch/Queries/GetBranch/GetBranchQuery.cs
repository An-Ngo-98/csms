using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using SystemApi.Business.Branch.ViewModels;
using SystemApi.Common.Extentions;
using SystemApi.Common.Paging;
using SystemApi.Data.Entities;
using SystemApi.Data.Services;

namespace SystemApi.Business.Branch.Queries.GetBranch
{
    public class GetBranchQuery : IGetBranchQuery
    {
        private readonly IRepository<CsmsBranch> _branchRepository;

        public GetBranchQuery(IRepository<CsmsBranch> branchRepository)
        {
            _branchRepository = branchRepository;
        }

        public async Task<PagedList<BranchViewModel>> ExecuteAsync(int page, int pageSize)
        {
            var queries = _branchRepository.TableNoTracking
                .Where(n => n.Deleted == false)
                .Select(n => new BranchViewModel
                {
                    Id = n.Id,
                    ShortName = n.ShortName,
                    Name = n.Name,
                    Location = n.Location,
                    Description = n.Description,
                    OpenTime = n.OpenTime.ToString(),
                    CloseTime = n.CloseTime.ToString(),
                    Enabled = n.Enabled,
                    Add_Country = n.Add_Country,
                    Add_Province = n.Add_Province,
                    Add_District = n.Add_District,
                    Add_Ward = n.Add_Ward,
                    Add_Detail = n.Add_Detail,
                    Tables = n.Tables,
                    SpaceFee = n.SpaceFee,
                    InternetFee = n.InternetFee,
                    PhoneNumbers = n.PhoneNumbers
                    .Select(p => new BranchPhoneNumberViewModel()
                    {
                        Id = p.Id,
                        PhoneNumber = p.PhoneNumber
                    }).ToList()
                })
                .OrderBy(x => x.ShortName);

            var result = await queries
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedList<BranchViewModel>(result, page, pageSize, await queries.CountAsync());
        }
    }
}
