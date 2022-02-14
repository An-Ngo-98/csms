using System;
using System.Net;
using System.Threading.Tasks;
using UsersApi.Business.Account.ViewModes;
using UsersApi.Common.Commands;
using UsersApi.Common.Securities.BCrypt;
using UsersApi.Constants.Message;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Account.Commands.ChangePassword
{
    public class ChangePasswordCommand : IChangePasswordCommand
    {
        private readonly IRepository<CsmsUser> _userRepository;
        private const string PASSWORD_NOT_MATCH = "Current password was incorrent";

        public ChangePasswordCommand(
            IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<CommandResult> ExecuteAsync(ChangePasswordViewModel model)
        {
            try
            {
                CommandResult isNotValidData = CheckValidData(model);

                if (isNotValidData != null)
                {
                    return isNotValidData;
                }

                var user = await _userRepository.GetByIdAsync(model.UserId);

                if (user == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.BadRequest,
                        Description = MessageErrors.NotFound
                    });
                }
                else
                {
                    if (BCrypt.CheckPassword(model.OldPassword, user.Password))
                    {
                        user.Password = BCrypt.HashPassword(model.NewPassword, BCrypt.GenerateSalt());
                        await _userRepository.UpdateAsync(user);
                    }
                    else
                    {
                        return CommandResult.Failed(new CommandResultError()
                        {
                            Code = (int)HttpStatusCode.NotFound,
                            Description = PASSWORD_NOT_MATCH
                        });
                    }
                }

                return CommandResult.Success;
            }
            catch (Exception)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = MessageErrors.InternalServerError
                });
            }
        }

        private CommandResult CheckValidData(ChangePasswordViewModel model)
        {
            if (model == default 
                || model.UserId == default 
                || model.OldPassword == default 
                || model.NewPassword == default
                || model.NewPassword.Length < 6)
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
