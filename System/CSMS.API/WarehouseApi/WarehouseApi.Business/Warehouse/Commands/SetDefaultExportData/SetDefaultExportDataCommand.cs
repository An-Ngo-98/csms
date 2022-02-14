using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;
using WarehouseApi.Constants.Message;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Warehouse.Commands.SetDefaultExportData
{
    public class SetDefaultExportDataCommand : ISetDefaultExportDataCommand
    {
        private readonly IRepository<CsmsStoreExportDefault> _storeExportDefaultRepository;

        public SetDefaultExportDataCommand(IRepository<CsmsStoreExportDefault> storeExportDefaultRepository)
        {
            _storeExportDefaultRepository = storeExportDefaultRepository;
        }

        public async Task<CommandResult> ExecuteAsync(List<ExportMaterialViewModel> listMaterial)
        {
            try
            {
                if (listMaterial == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.BadRequest,
                        Description = MessageError.SomeDataEmptyOrInvalid
                    });
                }
                else
                {
                    foreach (var item in listMaterial)
                    {
                        if (item.MaterialId <= 0 || item.BranchId < 0)
                        {
                            return CommandResult.Failed(new CommandResultError()
                            {
                                Code = (int)HttpStatusCode.BadRequest,
                                Description = MessageError.SomeDataEmptyOrInvalid
                            });
                        }
                    }
                }

                var materials = await _storeExportDefaultRepository.TableNoTracking
                    .Where(n => listMaterial.Select(x => x.BranchId).Contains(n.BranchId))
                    .ToListAsync();

                var insertList = listMaterial.Where(n => !materials.Select(m => new { m.MaterialId, m.BranchId }).Contains(new { n.MaterialId, n.BranchId }))
                    .Select(n => new CsmsStoreExportDefault()
                    {
                        BranchId = n.BranchId,
                        MaterialId = n.MaterialId,
                        QuantityUnit = n.QuantityUnit
                    });
                var updateList = materials.Where(n => listMaterial.Select(m => new { m.MaterialId, m.BranchId }).Contains(new { n.MaterialId, n.BranchId }))
                    .Select(n => new CsmsStoreExportDefault()
                    {
                        BranchId = n.BranchId,
                        MaterialId = n.MaterialId,
                        QuantityUnit = listMaterial.Find(x => x.BranchId == n.BranchId && x.MaterialId == n.MaterialId).QuantityUnit
                    });
                var deleteList = materials.Where(n => !listMaterial.Select(m => new { m.MaterialId, m.BranchId }).Contains(new { n.MaterialId, n.BranchId }));

                if (deleteList.Count() > 0)
                {
                    await _storeExportDefaultRepository.DeleteAsync(deleteList);
                }
                if (updateList.Count() > 0)
                {
                    await _storeExportDefaultRepository.UpdateAsync(updateList);
                }
                if (insertList.Count() > 0)
                {
                    await _storeExportDefaultRepository.InsertAsync(insertList);
                }

                return CommandResult.Success;
            }
            catch (Exception ex)
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
