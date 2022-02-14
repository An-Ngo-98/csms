using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.Queries.GetStoreWarehouse;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;
using WarehouseApi.Constants.Message;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Warehouse.Commands.SaveStoreWareHouse
{
    public class SaveStoreWareHouseCommand : ISaveStoreWareHouseCommand
    {
        private readonly IRepository<CsmsUsedMaterialLog> _usedMaterialLogRepository;
        private readonly IGetStoreWarehouseQuery _getStoreWarehouseQuery;

        public SaveStoreWareHouseCommand(
            IRepository<CsmsUsedMaterialLog> usedMaterialLogRepository,
            IGetStoreWarehouseQuery getStoreWarehouseQuery)
        {
            _usedMaterialLogRepository = usedMaterialLogRepository;
            _getStoreWarehouseQuery = getStoreWarehouseQuery;
        }

        public async Task<CommandResult> ExecuteAsync(List<StoreMaterialViewModel> listMaterial)
        {
            try
            {
                if (listMaterial == null || listMaterial.Count == 0)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.BadRequest,
                        Description = MessageError.SomeDataEmptyOrInvalid
                    });
                }

                var materialExists = await _getStoreWarehouseQuery.ExecuteAsync(listMaterial[0].BranchId);

                var newLogs = new List<CsmsUsedMaterialLog>();
                foreach (var item in materialExists)
                {
                    var newItem = listMaterial.Find(n => n.MaterialId == item.MaterialId && n.BranchId == item.BranchId);
                    if (newItem != null)
                    {
                        var quantityUsed = item.Amount - newItem.Amount;
                        if (quantityUsed < 0)
                        {
                            return CommandResult.Failed(new CommandResultError()
                            {
                                Code = (int)HttpStatusCode.BadRequest,
                                Description = MessageError.SomeDataEmptyOrInvalid
                            });
                        }
                        else if (quantityUsed > 0 && quantityUsed <= item.Amount)
                        {
                            newLogs.Add(new CsmsUsedMaterialLog()
                            {
                                BranchId = item.BranchId,
                                Amount = item.Amount - newItem.Amount,
                                MaterialId = item.MaterialId,
                                BranchName = item.BranchName
                            });
                        }
                    }
                }

                await _usedMaterialLogRepository.InsertAsync(newLogs);

                return CommandResult.Success;
            }
            catch (System.Exception)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = MessageError.InternalServerError
                });
            }
        }
    }
}
