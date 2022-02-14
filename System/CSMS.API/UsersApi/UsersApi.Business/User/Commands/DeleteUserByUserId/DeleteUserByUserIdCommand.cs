using System;
using System.Net;
using System.Threading.Tasks;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;
using UsersApi.Common.Commands;

namespace UsersApi.Business.User.Commands.DeleteUserByUserId
{
    public class DeleteUserByUserIdCommand : IDeleteUserByUserIdCommand
    {
        private readonly IRepository<CsmsUser> _userRepository;

        public DeleteUserByUserIdCommand(IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int userId)
        {
            try
            {
                CsmsUser user = await _userRepository.GetByIdAsync(userId);

                if (user != null)
                {
                    user.Deleted = true;
                    await _userRepository.UpdateAsync(user);

                    return CommandResult.Success;
                }

                return CommandResult.Failed(new CommandResultError
                {
                    Code = (int)HttpStatusCode.NotFound,
                    Description = "User not found"
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
