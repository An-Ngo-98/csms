using CdnApi.Constants;
using CdnApi.CrossCutting.Command;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace CdnApi.Business.Store.Commands.UploadStorePhoto
{
    public class UploadStorePhotoCommand : IUploadStorePhotoCommand
    {
        private readonly IRepository<CsmsStore> _storeRepository;

        public UploadStorePhotoCommand(IRepository<CsmsStore> storeRepository)
        {
            _storeRepository = storeRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int storeId, IFormFile file)
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

                if (file.Length > 4000000)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotAcceptable,
                        Description = "File size must less than 4Mb"
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

                CsmsStore entity = await _storeRepository.GetByIdAsync(storeId) ?? new CsmsStore();
                entity.PhotoSize = file.Length.ToString();
                entity.PhotoType = file.ContentType;
                entity.Photo = fileContent;
                entity.PhotoName = DateTime.Now.ToString(DateFormat.DateTimeFormatyyyyMMdd_hhmmss) + "." + fileExtend;

                if (entity.StoreId == 0)
                {
                    entity.StoreId = storeId;
                    await _storeRepository.InsertAsync(entity);
                }
                else
                {
                    await _storeRepository.UpdateAsync(entity);
                }

                return CommandResult.Success;
            }
            catch (Exception)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = Message.InternalServerError
                });
            }
        }
    }
}
