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

namespace WarehouseApi.Business.Warehouse.Commands.SetDefaultImportData
{
    public class SetDefaultImportDataCommand : ISetDefaultImportDataCommand
    {
        private readonly IRepository<CsmsMaterial> _materialRepository;

        public SetDefaultImportDataCommand(IRepository<CsmsMaterial> materialRepository)
        {
            _materialRepository = materialRepository;
        }

        public async Task<CommandResult> ExecuteAsync(List<ImportMaterialViewModel> listMaterial)
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

                var materials = await _materialRepository.Table
                    .Where(n => listMaterial.Select(x => x.MaterialId).Contains(n.Id))
                    .ToListAsync();

                foreach (var item in listMaterial)
                {
                    if (item.MaterialId <= 0 || item.QuantityUnit < 0)
                    {
                        return CommandResult.Failed(new CommandResultError()
                        {
                            Code = (int)HttpStatusCode.BadRequest,
                            Description = MessageError.SomeDataEmptyOrInvalid
                        });
                    }
                    else
                    {
                        var mat = materials.Where(n => n.Id == item.MaterialId).Single();
                        mat.DefaultPartnerId = item.PartnerId;
                        mat.DefaultQuantity = item.QuantityUnit;
                    }
                }

                await _materialRepository.UpdateAsync(materials);

                return CommandResult.Success;
            }
            catch (Exception)
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
