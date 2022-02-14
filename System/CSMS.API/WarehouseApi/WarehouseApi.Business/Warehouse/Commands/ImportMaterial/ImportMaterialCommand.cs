using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;
using WarehouseApi.Constants.Message;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Warehouse.Commands.ImportMaterial
{
    public class ImportMaterialCommand : IImportMaterialCommand
    {
        private readonly IRepository<CsmsImportHistory> _importRepository;

        public ImportMaterialCommand(IRepository<CsmsImportHistory> importRepository)
        {
            _importRepository = importRepository;
        }

        public async Task<CommandResult> ExecuteAsync(List<ImportMaterialViewModel> listMaterial)
        {
            try
            {
                var importList = new List<CsmsImportHistory>();
                foreach (var item in listMaterial)
                {
                    if (item.PartnerId <= 0 || item.MaterialId <= 0)
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
                            importList.Add(new CsmsImportHistory()
                            {
                                PartnerId = item.PartnerId.Value,
                                MaterialId = item.MaterialId,
                                QuantityUnit = item.QuantityUnit,
                                Price = item.Price,
                                HavePaid = item.HavePaid,
                                TotalPrice = item.Price * item.QuantityUnit
                            });
                        }
                    }
                }

                await _importRepository.InsertAsync(importList);

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
