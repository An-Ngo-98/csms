using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using WarehouseApi.Business.Partner.ViewModels;
using WarehouseApi.Common.Commands;
using WarehouseApi.Common.Extentions;
using WarehouseApi.Constants.Message;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Partner.Commands.SavePartner
{
    public class SavePartnerCommand : ISavePartnerCommand
    {
        private readonly IRepository<CsmsPartner> _partnerRepository;

        public SavePartnerCommand(IRepository<CsmsPartner> partnerRepository)
        {
            _partnerRepository = partnerRepository;
        }

        public async Task<CommandResult> ExecuteAsync(PartnerViewModel model)
        {
            try
            {
                if (!IsValidData(model))
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.BadRequest,
                        Description = MessageError.SomeDataEmptyOrInvalid
                    });
                }

                var entity = await _partnerRepository.Table
                    .Where(n => n.Id == model.Id)
                    .Include(n => n.PartnerMaterials)
                    .SingleOrDefaultAsync();

                entity ??= new CsmsPartner();
                entity.Name = model.Name;
                entity.PhoneNumber = model.PhoneNumber;
                entity.Address = model.Address;
                entity.PartnerMaterials = model.Materials.Select(n => new CsmsPartnerMaterial()
                {
                    Id = n.Id,
                    MaterialId = n.MaterialId,
                    Price = n.Price,
                    MaxUnit = n.MaxUnit
                }).ToList();

                if (model.Id == 0)
                {
                    await _partnerRepository.InsertAsync(entity);
                }
                else
                {
                    await _partnerRepository.UpdateAsync(entity);
                }

                return CommandResult.SuccessWithData(model);
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

        private bool IsValidData(PartnerViewModel model)
        {
            if (model == null || model.Id < 0 || model.Name.IsEmpty())
            {
                return false;
            }

            foreach (var item in model.Materials)
            {
                if (item.Price == default || item.MaterialId <= 0)
                {
                    return false;
                }
            }

            return true;
        }
    }
}
