using CdnApi.Common.Logging;
using CdnApi.Constants;
using CdnApi.CrossCutting.Command;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using System;
using System.Net;
using System.Threading.Tasks;

namespace CdnApi.Business.Product.Commands.DeleteProductPhoto
{
    public class DeleteProductPhotoCommand : IDeleteProductPhotoCommand
    {
        private readonly IRepository<CsmsProductsPhoto> _productPhotoRepository;

        public DeleteProductPhotoCommand(IRepository<CsmsProductsPhoto> productPhotoRepository)
        {
            _productPhotoRepository = productPhotoRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int imageId)
        {
            try
            {
                CsmsProductsPhoto photo = await _productPhotoRepository.GetByIdAsync(imageId);

                if (photo == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotFound,
                        Description = Message.NotFound
                    });
                }
                else
                {
                    await _productPhotoRepository.DeleteAsync(photo);
                    return CommandResult.Success;
                }
            }
            catch (Exception ex)
            {
                Logging<DeleteProductPhotoCommand>.Error(ex, "ImageId: " + imageId);
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = Message.InternalServerError
                });
            }
        }
    }
}
