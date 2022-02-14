using CdnApi.Constants;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CdnApi.Business.Store.Queries.GetStorePhoto
{
    public class GetStorePhotoQuery : IGetStorePhotoQuery
    {
        private readonly IRepository<CsmsStore> _storeRepository;
        private readonly IRepository<CsmsFilesDefault> _fileDefaultRepository;

        public GetStorePhotoQuery(
            IRepository<CsmsStore> storeRepository,
            IRepository<CsmsFilesDefault> fileDefaultRepository)
        {
            _storeRepository = storeRepository;
            _fileDefaultRepository = fileDefaultRepository;
        }

        public async Task<CsmsStore> ExecuteAsync(int storeId)
        {
            var result = await _storeRepository.TableNoTracking
                .Where(n => n.StoreId == storeId)
                .SingleOrDefaultAsync();

            if (result == null)
            {
                result = await _fileDefaultRepository.TableNoTracking
                    .Where(n => n.DefaultType == DefaultFileTypes.STORE_PHOTO_DEFAULT)
                    .Select(n => new CsmsStore()
                    {
                        PhotoName = n.Filename,
                        PhotoSize = n.FileSize,
                        PhotoType = n.FileType,
                        Photo = n.FileContent,
                        Status = n.Status
                    })
                    .FirstOrDefaultAsync();
            }

            return result;
        }
    }
}
