using System;
using System.Net;
using System.Threading.Tasks;
using UsersApi.Business.User.ViewModels;
using UsersApi.Common.Commands;
using UsersApi.Constants.Message;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.User.Commands.SaveUserAddress
{
    public class SaveUserAddressCommand : ISaveUserAddressCommand
    {
        private readonly IRepository<CsmsUserAddress> _userAddressRepository;

        public SaveUserAddressCommand(IRepository<CsmsUserAddress> userAddressRepository)
        {
            _userAddressRepository = userAddressRepository;
        }

        public async Task<CommandResult> ExecuteAsync(CsmsUserAddress model)
        {
            try
            {
                CommandResult isNotValidData = CheckValidData(model);

                if (isNotValidData != null)
                {
                    return isNotValidData;
                }

                var address = await _userAddressRepository.GetByIdAsync(model.Id);

                if (address == null)
                {
                    address = new CsmsUserAddress()
                    {
                        Id = 0,
                        UserId = model.UserId,
                        Receiver = model.Receiver,
                        PhoneNumber = model.PhoneNumber,
                        Country = model.Country,
                        Province = model.Province,
                        District = model.District,
                        Ward = model.Ward,
                        Detail = model.Detail,
                        IsDefault = model.IsDefault ?? false
                    };

                    await _userAddressRepository.InsertAsync(address);
                }
                else
                {
                    address.Receiver = model.Receiver;
                    address.PhoneNumber = model.PhoneNumber;
                    address.Country = model.Country;
                    address.Province = model.Province;
                    address.District = model.District;
                    address.Ward = model.Ward;
                    address.Detail = model.Detail;
                    address.IsDefault = model.IsDefault ?? false;

                    await _userAddressRepository.UpdateAsync(address);
                }

                return CommandResult.SuccessWithData(address);
            }
            catch (Exception)
            {
                //Logging<SaveEmployeeCertificateCommand>.Error(emodel, "Data: " + JsonConvert.SerializeObject(model));
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = MessageErrors.InternalServerError
                });
            }
        }

        private CommandResult CheckValidData(CsmsUserAddress model)
        {
            if (model == default
                || model.UserId == default
                || model.Receiver == default
                || model.PhoneNumber == default
                || model.Country == default
                || model.Province == default
                || model.District == default
                || model.Ward == default)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageErrors.SomeDataEmptyOrInvalid
                });
            }

            return null;
        }
    }
}
