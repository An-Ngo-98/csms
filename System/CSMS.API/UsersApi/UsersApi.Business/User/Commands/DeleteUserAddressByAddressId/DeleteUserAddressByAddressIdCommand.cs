using System;
using System.Net;
using System.Threading.Tasks;
using UsersApi.Common.Commands;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.User.Commands.DeleteUserAddressByAddressId
{
    public class DeleteUserAddressByAddressIdCommand : IDeleteUserAddressByAddressIdCommand
    {
        private readonly IRepository<CsmsUserAddress> _userAddressRepository;

        public DeleteUserAddressByAddressIdCommand(IRepository<CsmsUserAddress> userAddressRepository)
        {
            _userAddressRepository = userAddressRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int addressId)
        {
            try
            {
                CsmsUserAddress address = await _userAddressRepository.GetByIdAsync(addressId);

                if (address != null)
                {
                    await _userAddressRepository.DeleteAsync(address);

                    return CommandResult.Success;
                }

                return CommandResult.Failed(new CommandResultError
                {
                    Code = (int)HttpStatusCode.NotFound,
                    Description = "Address not found"
                });
            }
            catch (Exception ex)
            {
                //Logging<UpdateEmailTemplateCommand>.Error(ex, "Data: ", JsonConvert.SerializeObject(model));
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = ex.Message
                });
            }
        }
    }
}
