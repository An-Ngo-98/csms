using System.Threading.Tasks;
using WarehouseApi.Common.Commands;
using WarehouseApi.Data.Entities;

namespace WarehouseApi.Business.Material.Commands.SaveMaterial
{
    public interface ISaveMaterialCommand
    {
        Task<CommandResult> ExecuteAsync(CsmsMaterial model);
    }
}