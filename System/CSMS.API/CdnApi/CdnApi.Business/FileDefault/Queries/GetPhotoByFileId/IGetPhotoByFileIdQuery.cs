using CdnApi.Data.Entities;
using System.Threading.Tasks;

namespace CdnApi.Business.FileDefault.Queries.GetPhotoByFileId
{
    public interface IGetPhotoByFileIdQuery
    {
        Task<CsmsFilesDefault> ExecuteAsync(int fileId);
    }
}