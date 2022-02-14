using System;
using System.Net;
using System.Threading.Tasks;
using UsersApi.Business.User.ViewModels;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;
using UsersApi.Constants.Message;
using UsersApi.Business.User.Queries.GetUserInfoByUserId;
using UsersApi.Common.Commands;
using UsersApi.Common.Securities.BCrypt;
using UsersApi.Common.Extensions;
using System.Linq;

namespace UsersApi.Business.User.Commands.SaveUser
{
    public class SaveUserCommand : ISaveUserCommand
    {
        private readonly IRepository<CsmsUser> _userRepository;
        private readonly IGetUserInfoByUserIdQuery _getUserInfoByUserIdQuery;
        private UserInfoViewModel userInfoViewModel;

        public SaveUserCommand(
            IRepository<CsmsUser> userRepository,
            IGetUserInfoByUserIdQuery getUserInfoByUserIdQuery)
        {
            _userRepository = userRepository;
            _getUserInfoByUserIdQuery = getUserInfoByUserIdQuery;
        }

        public async Task<CommandResult> ExecuteAsync(SaveUserViewModel model)
        {
            try
            {
                CommandResult isNotValidData = CheckValidData(model);

                if (isNotValidData != null)
                {
                    return isNotValidData;
                }

                var user = await _userRepository.GetByIdAsync(model.Id);

                if (user == null)
                {
                    if (model.Password.IsEmpty())
                    {
                        return CommandResult.Failed(new CommandResultError()
                        {
                            Code = (int)HttpStatusCode.BadRequest,
                            Description = MessageErrors.SomeDataEmptyOrInvalid
                        });
                    }

                    user = new CsmsUser()
                    {
                        Id = 0,
                        UserCode = model.UserCode,
                        Username = model.UserName,
                        Password = BCrypt.HashPassword(model.Password, BCrypt.GenerateSalt()),
                        FirstName = model.FirstName,
                        MiddleName = model.MiddleName,
                        LastName = model.LastName,
                        Email = model.Email,
                        PhoneNumber = model.PhoneNumber,
                        CitizenID = model.CitizenId,
                        Gender = model.Gender,
                        Salary = model.Salary,
                        BranchId = model.BranchId,
                        Birthday = model.Birthday,
                        RoleId = model.RoleId,
                        StatusId = model.StatusId
                    };

                    await _userRepository.InsertAsync(user);
                    userInfoViewModel = await _getUserInfoByUserIdQuery.ExecuteAsync(user.Id);
                }
                else
                {
                    user.UserCode = model.UserCode;
                    user.Username = model.UserName;
                    user.Password = (user.Password == model.Password || model.Password.IsEmpty())
                        ? user.Password : BCrypt.HashPassword(model.Password, BCrypt.GenerateSalt());
                    user.FirstName = model.FirstName;
                    user.MiddleName = model.MiddleName;
                    user.LastName = model.LastName;
                    user.Email = model.Email;
                    user.PhoneNumber = model.PhoneNumber;
                    user.CitizenID = model.CitizenId;
                    user.Gender = model.Gender;
                    user.Salary = model.Salary;
                    user.BranchId = model.BranchId;
                    user.Birthday = model.Birthday;
                    user.RoleId = model.RoleId;
                    user.StatusId = model.StatusId;

                    await _userRepository.UpdateAsync(user);
                    userInfoViewModel = await _getUserInfoByUserIdQuery.ExecuteAsync(user.Id);
                }

                return CommandResult.SuccessWithData(userInfoViewModel);
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

        private CommandResult CheckValidData(SaveUserViewModel model)
        {
            if (model == default || model.FirstName == default || model.LastName == default)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageErrors.SomeDataEmptyOrInvalid
                });
            }

            if (CheckEmailExist(model.Email, model.Id))
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.NotAcceptable,
                    Description = MessageErrors.DataIsExists.Replace("{0}", "Email")
                });
            }

            if (CheckPhoneNumberExist(model.PhoneNumber, model.Id))
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.NotAcceptable,
                    Description = MessageErrors.DataIsExists.Replace("{0}", "Phone number")
                });
            }

            return null;
        }

        private bool CheckEmailExist(string email, int userId)
        {
            email = email.Trim().Replace(" ", "");

            if (email.IsEmpty())
            {
                return false;
            }

            return _userRepository.TableNoTracking
                .Any(n =>
                (n.Email.Trim().Replace(" ", "") == email) &&
                (n.Id != userId) &&
                (n.Deleted != true));
        }

        private bool CheckPhoneNumberExist(string phoneNumber, int userId)
        {
            phoneNumber = phoneNumber.Trim().Replace(" ", "");

            if (phoneNumber.IsEmpty())
            {
                return false;
            }

            return _userRepository.TableNoTracking
                .Any(n =>
                n.PhoneNumber.Trim().Replace(" ", "") == phoneNumber &&
                n.Id != userId &&
                n.Deleted != true);
        }
    }
}
