using CdnApi.Data.Entities;
using System.Threading.Tasks;

namespace CdnApi.Business.Category.Queries.GetCategoryPhoto
{
    public interface IGetCategoryPhotoQuery
    {
        Task<CsmsCategory> ExecuteAsync(int categoryId);
    }
}