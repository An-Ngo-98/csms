using CdnApi.Business.FileDefault.ViewModels;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CdnApi.Business.FileDefault.Queries.GetListDefaultFiles
{
    public class GetListDefaultFilesQuery : IGetListDefaultFilesQuery
    {
        private readonly IRepository<CsmsFilesDefault> _fileDefaultRepository;

        public GetListDefaultFilesQuery(IRepository<CsmsFilesDefault> fileDefaultRepository)
        {
            _fileDefaultRepository = fileDefaultRepository;
        }

        public async Task<List<FileDefaultViewModel>> ExecuteAsync()
        {
            var result = await _fileDefaultRepository.TableNoTracking
                .Select(n => new FileDefaultViewModel()
                {
                    Id = n.Id,
                    DefaultType = n.DefaultType,
                    Title = n.Title,
                    FileName = n.Filename,
                    FileType = n.FileType,
                    FileSize = n.FileSize,
                    Status = n.Status
                })
                .ToListAsync();

            return result;
        }
    }
}
