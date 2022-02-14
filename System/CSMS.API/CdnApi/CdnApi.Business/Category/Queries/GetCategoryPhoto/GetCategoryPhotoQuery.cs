using CdnApi.Constants;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CdnApi.Business.Category.Queries.GetCategoryPhoto
{
    public class GetCategoryPhotoQuery : IGetCategoryPhotoQuery
    {
        private readonly IRepository<CsmsCategory> _categoryRepository;
        private readonly IRepository<CsmsFilesDefault> _fileDefaultRepository;

        public GetCategoryPhotoQuery(
            IRepository<CsmsCategory> categoryRepository,
            IRepository<CsmsFilesDefault> fileDefaultRepository)
        {
            _categoryRepository = categoryRepository;
            _fileDefaultRepository = fileDefaultRepository;
        }

        public async Task<CsmsCategory> ExecuteAsync(int categoryId)
        {
            var result = await _categoryRepository.TableNoTracking
                .Where(n => n.CategoryId == categoryId)
                .SingleOrDefaultAsync();

            if (result == null)
            {
                result = await _fileDefaultRepository.TableNoTracking
                    .Where(n => n.DefaultType == DefaultFileTypes.CATEGORY_PHOTO_DEFAULT)
                    .Select(n => new CsmsCategory()
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
