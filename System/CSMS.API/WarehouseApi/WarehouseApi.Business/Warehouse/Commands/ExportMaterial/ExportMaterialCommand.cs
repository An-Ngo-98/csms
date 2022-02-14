using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;
using WarehouseApi.Constants.Message;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Warehouse.Commands.ExportMaterial
{
    public class ExportMaterialCommand : IExportMaterialCommand
    {
        private readonly IRepository<CsmsExportHistory> _exportRepository;

        public ExportMaterialCommand(IRepository<CsmsExportHistory> exportRepository)
        {
            _exportRepository = exportRepository;
        }

        public async Task<CommandResult> ExecuteAsync(List<ExportMaterialViewModel> listMaterial)
        {
            try
            {
                var exportList = new List<CsmsExportHistory>();
                foreach (var item in listMaterial)
                {
                    if (item.BranchId <= 0 || item.MaterialId <= 0)
                    {
                        return CommandResult.Failed(new CommandResultError()
                        {
                            Code = (int)HttpStatusCode.BadRequest,
                            Description = MessageError.SomeDataEmptyOrInvalid
                        });
                    }
                    else
                    {
                        if (item.QuantityUnit > 0)
                        {
                            exportList.Add(new CsmsExportHistory()
                            {
                                BranchId = item.BranchId,
                                BranchName = item.BranchName,
                                MaterialId = item.MaterialId,
                                QuantityUnit = item.QuantityUnit
                            });
                        }
                    }
                }

                await _exportRepository.InsertAsync(exportList);

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
