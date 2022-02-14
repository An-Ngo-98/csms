using CdnApi.Common.Extensions;
using CdnApi.Constants;
using CdnApi.CrossCutting.Command;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CdnApi.Business.FileDefault.Commands.UploadFileDefault
{
    public class UploadFileDefaultCommand : IUploadFileDefaultCommand
    {
        private readonly IRepository<CsmsFilesDefault> _defaultFileRepository;

        public UploadFileDefaultCommand(IRepository<CsmsFilesDefault> defaultFileRepository)
        {
            _defaultFileRepository = defaultFileRepository;
        }

        public async Task<CommandResult> ExecuteAsync(string defaultFileType, string title, IFormFile file)
        {
            try
            {
                if (file == null || defaultFileType.IsEmpty() || title.IsEmpty())
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotAcceptable,
                        Description = "Data is invalid"
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

                CsmsFilesDefault entity = await _defaultFileRepository.TableNoTracking
                    .Where(n => n.DefaultType == defaultFileType)
                    .FirstOrDefaultAsync();

                entity = entity ?? new CsmsFilesDefault();
                entity.DefaultType = defaultFileType;
                entity.Title = title;
                entity.FileSize = file.Length.ToString();
                entity.FileType = file.ContentType;
                entity.FileContent = fileContent;
                entity.Filename = DateTime.Now.ToString(DateFormat.DateTimeFormatyyyyMMdd_hhmmss) + "." + fileExtend;

                if (entity.Id == 0)
                {
                    await _defaultFileRepository.InsertAsync(entity);
                }
                else
                {
                    await _defaultFileRepository.UpdateAsync(entity);
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
