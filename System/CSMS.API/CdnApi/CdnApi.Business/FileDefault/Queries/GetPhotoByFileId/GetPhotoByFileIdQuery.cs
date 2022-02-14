using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using System.Threading.Tasks;

namespace CdnApi.Business.FileDefault.Queries.GetPhotoByFileId
{
    public class GetPhotoByFileIdQuery : IGetPhotoByFileIdQuery
    {
        private readonly IRepository<CsmsFilesDefault> _fileDefaultRepository;

        public GetPhotoByFileIdQuery(IRepository<CsmsFilesDefault> fileDefaultRepository)
        {
            _fileDefaultRepository = fileDefaultRepository;
        }

        public async Task<CsmsFilesDefault> ExecuteAsync(int fileId)
        {
            var result = await _fileDefaultRepository.GetByIdAsync(fileId);

            return result;
        }
    }
}
