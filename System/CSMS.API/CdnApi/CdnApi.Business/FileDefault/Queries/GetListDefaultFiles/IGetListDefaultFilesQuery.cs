using CdnApi.Business.FileDefault.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CdnApi.Business.FileDefault.Queries.GetListDefaultFiles
{
    public interface IGetListDefaultFilesQuery
    {
        Task<List<FileDefaultViewModel>> ExecuteAsync();
    }
}