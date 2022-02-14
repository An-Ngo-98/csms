using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Common.Commands;
using UsersApi.Common.Extensions;
using UsersApi.Common.Securities.BCrypt;
using UsersApi.Constants.Message;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Customer.Commands.SaveCustomer
{
    public class SaveCustomerCommand : ISaveCustomerCommand
    {
        public readonly IRepository<CsmsUser> _userRepository;

        public SaveCustomerCommand(IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<CommandResult> ExecuteSocialAsync(SaveCustomerSocialViewModel model)
        {
            try
            {
                if (model.Id == default)
                {
                    CsmsUser user = new CsmsUser()
                    {
                        Id = 0,
                        RoleId = 1,
                        FirstName = model.Name,
                        MiddleName ="",
                        LastName ="",
                        Email = model.Email,
                    };

                    await _userRepository.InsertAsync(user);
                    return GetUserDataSuccess(user);
                }
                else
                {
                    var user = await _userRepository.GetByIdAsync(model.Id);

                    if (user == null)
                    {
                        return CommandResult.Failed(new CommandResultError()
                        {
                            Code = (int)HttpStatusCode.NotFound,
                            Description = MessageErrors.NotFound
                        });
                    }
                    else
                    {
                        user.FirstName = model.Name;
                        user.Email = model.Email;
                        await _userRepository.UpdateAsync(user);
                        return GetUserDataSuccess(user);
                    }
                }
            }
            catch (Exception ex)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = MessageErrors.InternalServerError
                });
            }
        }

        public async Task<CommandResult> ExecuteAsync(SaveCustomerViewModel model)
        {
            try
            {
                CommandResult isNotValidDate = CheckValidData(model);

                if (isNotValidDate != null)
                {
                    return isNotValidDate;
                }

                if (model.Id == default)
                {


                    CsmsUser user = new CsmsUser()
                    {
                        Id = 0,
                        RoleId = 1,
                        FirstName = model.FirstName,
                        MiddleName = model.MiddleName,
                        LastName = model.LastName,
                        PhoneNumber = model.PhoneNumber,
                        Email = model.Email,
                        Birthday = model.Birthday,
                        Gender = model.Gender,
                        Password = BCrypt.HashPassword(model.Password, BCrypt.GenerateSalt())
                    };

                    await _userRepository.InsertAsync(user);
                    return GetUserDataSuccess(user);
                }
                else
                {
                    var user = await _userRepository.GetByIdAsync(model.Id);

                    if (user == null)
                    {
                        return CommandResult.Failed(new CommandResultError()
                        {
                            Code = (int)HttpStatusCode.NotFound,
                            Description = MessageErrors.NotFound
                        });
                    }
                    else
                    {
                        user.FirstName = model.FirstName;
                        user.MiddleName = model.MiddleName;
                        user.LastName = model.LastName;
                        user.PhoneNumber = model.PhoneNumber;
                        user.Email = model.Email;
                        user.Birthday = model.Birthday;
                        user.Gender = model.Gender;

                        await _userRepository.UpdateAsync(user);
                        return GetUserDataSuccess(user);
                    }
                }
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

        private CommandResult CheckValidData(SaveCustomerViewModel model)
        {
            if (model == default
                || model.FirstName == default
                || model.LastName == default
                || model.Email == default
                || model.PhoneNumber == default
                || (model.Id == default && model.Password.IsEmpty()))
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

            return _userRepository.TableNoTracking
                .Any(n =>
                n.Email.Trim().Replace(" ", "") == email &&
                n.Id != userId &&
                n.Deleted != true);
        }

        private bool CheckPhoneNumberExist(string phoneNumber, int userId)
        {
            phoneNumber = phoneNumber.Trim().Replace(" ", "");

            return _userRepository.TableNoTracking
                .Any(n =>
                n.PhoneNumber.Trim().Replace(" ", "") == phoneNumber &&
                n.Id != userId &&
                n.Deleted != true);
        }

        private CommandResult GetUserDataSuccess(CsmsUser user)
        {
            CustomerViewModel customer = new CustomerViewModel()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                Birthday = user.Birthday,
                Gender = user.Gender,
                CreatedDate = user.CreateDate
            };

            return CommandResult.SuccessWithData(customer);
        }
    }
}
