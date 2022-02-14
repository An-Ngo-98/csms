using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SystemApi.Business.Branch.ViewModels;
using SystemApi.Common.Extentions;
using SystemApi.Data.Entities;
using SystemApi.Data.Services;

namespace SystemApi.Business.Branch.Queries.GetEnableBranch
{
    public class GetEnableBranchQuery : IGetEnableBranchQuery
    {
        private readonly IRepository<CsmsBranch> _branchRepository;

        public GetEnableBranchQuery(IRepository<CsmsBranch> branchRepository)
        {
            _branchRepository = branchRepository;
        }

        public async Task<List<EnableBranchViewModel>> ExecuteAsync()
        {
            var data = await _branchRepository.TableNoTracking
            .Where(x => x.Enabled == true && x.Deleted == false)
            .Include(x => x.PhoneNumbers)
            .OrderBy((x) => x.ShortName)
            .ToListAsync();

            var result = data.Select(x => new EnableBranchViewModel
            {
                Id = x.Id,
                ShortName = x.ShortName,
                Name = x.Name,
                OpenTime = DateTime.Today.Add(x.OpenTime).ToString("hh:mm tt")
                    + " - "
                    + DateTime.Today.Add(x.CloseTime).ToString("hh:mm tt"),
                Latitude = x.Location.Length == 0 ? 0 : double.Parse(x.Location.Split(" | ")[0]),
                Longitude = x.Location.Length == 0 ? 0 : double.Parse(x.Location.Split(" | ")[1]),
                Description = x.Description,
                Address = x.Add_Detail + ", " + x.Add_Ward + ", " + x.Add_District + ", " + x.Add_Province,
                Tables = x.Tables,
                SpaceFee = x.SpaceFee,
                InternetFee = x.InternetFee,
                PhoneNumbers = x.PhoneNumbers.Select(n => n.PhoneNumber).ToList()
            }).ToList();

            return result;
        }
    }
}
