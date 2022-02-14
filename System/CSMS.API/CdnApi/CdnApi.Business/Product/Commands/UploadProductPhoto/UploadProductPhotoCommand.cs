using CdnApi.Business.Product.ViewModels;
using CdnApi.Common.Logging;
using CdnApi.Constants;
using CdnApi.CrossCutting.Command;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace CdnApi.Business.Product.Commands.UploadProductPhoto
{
    public class UploadProductPhotoCommand : IUploadProductPhotoCommand
    {
        private readonly IRepository<CsmsProductsPhoto> _productPhotoRepository;

        public UploadProductPhotoCommand(IRepository<CsmsProductsPhoto> productPhotoRepository)
        {
            _productPhotoRepository = productPhotoRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int imageId, IFormFile file)
        {
            try
            {
                if (file == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotAcceptable,
                        Description = "File is null"
                    });
                }

                if (file.Length < 50000 || file.Length > 4000000)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotAcceptable,
                        Description = "File size must to beetween 50kb and 4Mb"
                    });
                }

                if (!file.ContentType.Contains("image/"))
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotAcceptable,
                        Description = "File not support"
                    });
                }

                var names = file.FileName.Split('.');
                var fileExtend = names[names.Length - 1];

                byte[] fileContent;
                using (Stream stream = file.OpenReadStream())
                {
                    using (var binaryReader = new BinaryReader(stream))
                    {
                        fileContent = binaryReader.ReadBytes((int)file.Length);
                    }
                }

                CsmsProductsPhoto entity = await _productPhotoRepository.GetByIdAsync(imageId) ?? new CsmsProductsPhoto();
                entity.FileSize = file.Length.ToString();
                entity.FileType = file.ContentType;
                entity.Picture = fileContent;
                entity.Filename = DateTime.Now.ToString(DateFormat.DateTimeFormatyyyyMMdd_hhmmss) + "." + fileExtend;

                if (entity.Id == 0)
                {
                    await _productPhotoRepository.InsertAsync(entity);
                }
                else
                {
                    await _productPhotoRepository.UpdateAsync(entity);
                }

                return CommandResult.SuccessWithData(new UploadPhotoSuccessViewModel(entity.Id));
            }
            catch (Exception ex)
            {
                Logging<UploadProductPhotoCommand>.Error(ex);
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = Message.InternalServerError
                });
            }
        }
    }
}
