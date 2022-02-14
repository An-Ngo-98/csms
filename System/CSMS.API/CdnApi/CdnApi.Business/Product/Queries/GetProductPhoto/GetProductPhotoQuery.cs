using CdnApi.Business.Product.ViewModels;
using CdnApi.Constants;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CdnApi.Business.Product.Queries.GetProductPhoto
{
    public class GetProductPhotoQuery : IGetProductPhotoQuery
    {
        private readonly IRepository<CsmsProductsPhoto> _productPhotoRepository;
        private readonly IRepository<CsmsFilesDefault> _fileDefaultRepository;

        public GetProductPhotoQuery(
            IRepository<CsmsProductsPhoto> productPhotoRepository,
            IRepository<CsmsFilesDefault> fileDefaultRepository)
        {
            _productPhotoRepository = productPhotoRepository;
            _fileDefaultRepository = fileDefaultRepository;
        }

        public async Task<ProductPhotoViewModel> ExecuteAsync(int imageId)
        {
            var result = await _productPhotoRepository.TableNoTracking
                .Where(n => n.Id == imageId)
                .Select(n => new ProductPhotoViewModel()
                {
                    Id = n.Id,
                    Filename = n.Filename,
                    FileSize = n.FileSize,
                    FileType = n.FileType,
                    Content = n.Picture,
                    Enabled = n.Status
                })
                .FirstOrDefaultAsync();

            if (result == null)
            {
                result = await _fileDefaultRepository.TableNoTracking
                    .Where(n => n.DefaultType == DefaultFileTypes.PRODUCT_PHOTO_DEFAULT)
                    .Select(n => new ProductPhotoViewModel()
                    {
                        Filename = n.Filename,
                        FileSize = n.FileSize,
                        FileType = n.FileType,
                        Content = n.FileContent,
                        Enabled = n.Status
                    })
                    .FirstOrDefaultAsync();
            }

            return result;
        }
    }
}
