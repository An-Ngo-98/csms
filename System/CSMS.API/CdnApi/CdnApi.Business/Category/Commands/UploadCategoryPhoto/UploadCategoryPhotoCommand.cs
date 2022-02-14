using CdnApi.Constants;
using CdnApi.CrossCutting.Command;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace CdnApi.Business.Category.Commands.UploadCategoryPhoto
{
    public class UploadCategoryPhotoCommand : IUploadCategoryPhotoCommand
    {
        private readonly IRepository<CsmsCategory> _categoryRepository;

        public UploadCategoryPhotoCommand(IRepository<CsmsCategory> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int categoryId, IFormFile file)
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

                CsmsCategory entity = await _categoryRepository.GetByIdAsync(categoryId) ?? new CsmsCategory();
                entity.PhotoSize = file.Length.ToString();
                entity.PhotoType = file.ContentType;
                entity.Photo = fileContent;
                entity.PhotoName = DateTime.Now.ToString(DateFormat.DateTimeFormatyyyyMMdd_hhmmss) + "." + fileExtend;

                if (entity.CategoryId == 0)
                {
                    entity.CategoryId = categoryId;
                    await _categoryRepository.InsertAsync(entity);
                }
                else
                {
                    await _categoryRepository.UpdateAsync(entity);
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
