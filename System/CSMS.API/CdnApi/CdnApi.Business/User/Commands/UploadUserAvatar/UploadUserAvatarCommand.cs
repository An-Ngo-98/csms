using CdnApi.Business.User.ViewModels;
using CdnApi.Common.Logging;
using CdnApi.Constants;
using CdnApi.CrossCutting.Command;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CdnApi.Business.User.Commands.UploadUserAvatarCommand
{
    public class UploadUserAvatarCommand : IUploadUserAvatarCommand
    {
        private readonly IDistributedCache _cache;
        private readonly IRepository<CsmsUsersAvatar> _usersAvatarRepository;

        public UploadUserAvatarCommand(
            IDistributedCache cache,
            IRepository<CsmsUsersAvatar> usersAvatarRepository)
        {
            _usersAvatarRepository = usersAvatarRepository;
            _cache = cache;
        }

        public async Task<CommandResult> ExecuteAsync(IFormFile file, int userId)
        {
            try
            {
                if (file == null || userId <= 0)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotAcceptable,
                        Description = "File or UserId is null"
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

                // Check user exists if need

                var names = file.FileName.Split('.');
                var fileExtend = names[names.Length - 1];
                var fileName = userId.ToString();

                byte[] fileContent;
                using (Stream stream = file.OpenReadStream())
                {
                    using (var binaryReader = new BinaryReader(stream))
                    {
                        fileContent = binaryReader.ReadBytes((int)file.Length);
                    }
                }

                var userAvatar = await _usersAvatarRepository.Table.Where(n => n.UserId == userId).FirstOrDefaultAsync();

                if (userAvatar != null)
                {
                    userAvatar.Picture = fileContent;
                    userAvatar.FileSize = file.Length.ToString();
                    userAvatar.FileType = file.ContentType;
                    userAvatar.Filename = fileName + "." + fileExtend;
                    await _usersAvatarRepository.UpdateAsync(userAvatar);
                    await ReplaceCacheImg(userAvatar);
                }
                else
                {
                    CsmsUsersAvatar entity = new CsmsUsersAvatar()
                    {
                        UserId = userId,
                        Filename = fileName + "." + fileExtend,
                        FileSize = file.Length.ToString(),
                        FileType = file.ContentType,
                        Picture = fileContent,
                        Status = "1"
                    };

                    await _usersAvatarRepository.InsertAsync(entity);
                    await ReplaceCacheImg(entity);
                }

                return CommandResult.Success;
            }
            catch (Exception ex)
            {
                Logging<UploadUserAvatarCommand>.Error(ex, "UserId: " + userId);
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = Message.InternalServerError
                });
            }
        }

        private async Task ReplaceCacheImg(CsmsUsersAvatar photo)
        {
            UserAvatarViewModel result = new UserAvatarViewModel()
            {
                Id = photo.Id,
                UserId = photo.UserId,
                Content = photo.Picture,
                FileType = photo.FileType,
                Filename = photo.Filename,
                FileSize = photo.FileSize
            };

            await _cache.SetStringAsync(CacheKey.USER_PHOTO + photo.UserId, JsonConvert.SerializeObject(result), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(60)
            });
        }
    }
}
