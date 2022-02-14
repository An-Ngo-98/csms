using CdnApi.Business.User.ViewModels;
using CdnApi.Constants;
using CdnApi.Data.Entities;
using CdnApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CdnApi.Business.User.Queries.GetUserAvatar
{
    public class GetUserAvatarQuery : IGetUserAvatarQuery
    {
        private readonly IDistributedCache _cache;
        private readonly IRepository<CsmsUsersAvatar> _avatarRepository;
        private readonly IRepository<CsmsFilesDefault> _fileDefaultRepository;

        public GetUserAvatarQuery(
            IDistributedCache memoryCache,
            IRepository<CsmsUsersAvatar> avatarRepository,
            IRepository<CsmsFilesDefault> fileDefaultRepository)
        {
            _cache = memoryCache;
            _avatarRepository = avatarRepository;
            _fileDefaultRepository = fileDefaultRepository;
        }


        public async Task<UserAvatarViewModel> ExecuteAsync(int userId)
        {
            return await GetAvatarByUserId(userId);
        }

        public async Task<UserAvatarViewModel> ExecuteAndSaveCacheAsync(int userId)
        {
            UserAvatarViewModel result = new UserAvatarViewModel();

            var cacheData = await _cache.GetStringAsync(CacheKey.USER_PHOTO + userId);
            if (cacheData != null)
            {
                result = JsonConvert.DeserializeObject<UserAvatarViewModel>(cacheData);
            }
            else
            {
                result = await GetAvatarByUserId(userId);

                await _cache.SetStringAsync(CacheKey.USER_PHOTO + userId, JsonConvert.SerializeObject(result), new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(60)
                });
            }

            return result;
        }

        private async Task<UserAvatarViewModel> GetAvatarByUserId(int userId)
        {
            var result = await _avatarRepository.TableNoTracking
                .Where(n => n.UserId == userId)
                .Select(n => new UserAvatarViewModel()
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    Filename = n.Filename,
                    FileSize = n.FileSize,
                    FileType = n.FileType,
                    Content = n.Picture
                })
                .FirstOrDefaultAsync();

            if (result == null)
            {
                result = await _fileDefaultRepository.TableNoTracking
                    .Where(n => n.DefaultType == DefaultFileTypes.USER_AVATAR_DEFAULT)
                    .Select(n => new UserAvatarViewModel()
                    {
                        UserId = 0,
                        Filename = n.Filename,
                        FileSize = n.FileSize,
                        FileType = n.FileType,
                        Content = n.FileContent
                    })
                    .FirstOrDefaultAsync();
            }

            return result;
        }
    }
}
