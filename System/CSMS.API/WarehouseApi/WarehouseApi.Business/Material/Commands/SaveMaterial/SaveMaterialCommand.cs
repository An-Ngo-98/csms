using System;
using System.Net;
using System.Threading.Tasks;
using WarehouseApi.Common.Commands;
using WarehouseApi.Common.Extentions;
using WarehouseApi.Constants.Message;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Material.Commands.SaveMaterial
{
    public class SaveMaterialCommand : ISaveMaterialCommand
    {
        private readonly IRepository<CsmsMaterial> _materialRepository;

        public SaveMaterialCommand(IRepository<CsmsMaterial> materialRepository)
        {
            _materialRepository = materialRepository;
        }

        public async Task<CommandResult> ExecuteAsync(CsmsMaterial model)
        {
            try
            {
                if (model == null || model.Id < 0 || model.Name.IsEmpty() || model.Unit.IsEmpty())
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.BadRequest,
                        Description = MessageError.SomeDataEmptyOrInvalid
                    });
                }

                if (model.Id == 0)
                {
                    await _materialRepository.InsertAsync(model);
                }
                else
                {
                    await _materialRepository.UpdateAsync(model);
                }

                return CommandResult.SuccessWithData(model);
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
