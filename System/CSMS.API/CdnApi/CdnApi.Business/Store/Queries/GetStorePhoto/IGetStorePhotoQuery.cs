using CdnApi.Data.Entities;
using System.Threading.Tasks;

namespace CdnApi.Business.Store.Queries.GetStorePhoto
{
    public interface IGetStorePhotoQuery
    {
        Task<CsmsStore> ExecuteAsync(int storeId);
    }
}