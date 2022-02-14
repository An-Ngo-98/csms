using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SystemApi.Business.Branch.ViewModels;
using SystemApi.Common.Commands;
using SystemApi.Common.Enums;
using SystemApi.Common.Extentions;
using SystemApi.Constants;
using SystemApi.Data.Entities;
using SystemApi.Data.Services;

namespace SystemApi.Business.Branch.Commands.SaveBranch
{
    public class SaveBranchCommand : ISaveBranchCommand
    {
        private readonly IRepository<CsmsBranch> _branchRepository;

        public SaveBranchCommand(IRepository<CsmsBranch> branchRepository)
        {
            _branchRepository = branchRepository;
        }

        public async Task<CommandResult> ExecuteAsync(BranchViewModel model)
        {
            try
            {
                if (model == null || model.ShortName.IsEmpty() || model.Name.IsEmpty())
                {
                    return CommandResult.Failed(
                            new CommandResultError
                            {
                                Code = (int)HttpStatusCode.BadRequest,
                                Description = MessageError.SomeDataEmptyOrInvalid
                            });
                }
                else
                {
                    model.ShortName = model.ShortName.IsEmpty() ? null : model.ShortName.Trim();
                    model.Name = model.Name.IsEmpty() ? null : model.Name.Trim();
                    model.Description = model.Description.IsEmpty() ? null : model.Description.Trim();

                    var branch = await _branchRepository.Table
                        .Where(n => n.Id == model.Id)
                        .Include(n => n.PhoneNumbers)
                        .SingleOrDefaultAsync() ?? new CsmsBranch();

                    branch.ShortName = model.ShortName;
                    branch.Name = model.Name;
                    branch.OpenTime = !model.OpenTime.IsEmpty() ? TimeSpan.Parse(model.OpenTime) : branch.OpenTime;
                    branch.CloseTime = !model.CloseTime.IsEmpty() ? TimeSpan.Parse(model.CloseTime) : branch.CloseTime;
                    branch.Location = model.Location;
                    branch.Description = model.Description;
                    branch.Enabled = model.Enabled;
                    branch.Add_Country = model.Add_Country;
                    branch.Add_Province = model.Add_Province;
                    branch.Add_District = model.Add_District;
                    branch.Add_Ward = model.Add_Ward;
                    branch.Add_Detail = model.Add_Detail;
                    branch.Tables = model.Tables;
                    branch.SpaceFee = model.SpaceFee;
                    branch.InternetFee = model.InternetFee;
                    branch.PhoneNumbers.Clear();

                    foreach (var item in model.PhoneNumbers)
                    {
                        branch.PhoneNumbers.Add(new CsmsBranchPhoneNumber()
                        {
                            Id = item.Id,
                            BranchId = model.Id,
                            PhoneNumber = item.PhoneNumber
                        });
                    }

                    if (branch.Id == default)
                    {
                        if (await _branchRepository.TableNoTracking.AnyAsync(x => x.ShortName.ToLower() == model.ShortName.ToLower()))
                        {
                            return CommandResult.Failed(
                                new CommandResultError
                                {
                                    Code = (int)HttpStatusCode.Conflict,
                                    Description = "The Branch has already existed"
                                });
                        }

                        await _branchRepository.InsertAsync(branch);
                    }
                    else
                    {
                        if (await _branchRepository.TableNoTracking.AnyAsync(x => x.Id != model.Id && x.ShortName.ToLower() == model.ShortName.ToLower()))
                        {
                            return CommandResult.Failed(
                                new CommandResultError
                                {
                                    Code = (int)HttpStatusCode.Conflict,
                                    Description = "The short name of branch has already existed"
                                });
                        }

                        await _branchRepository.UpdateAsync(branch);
                    }

                    model = new BranchViewModel()
                    {
                        Id = branch.Id,
                        ShortName = branch.ShortName,
                        Name = branch.Name,
                        Location = branch.Location,
                        Description = branch.Description,
                        OpenTime = branch.OpenTime.ToString(),
                        CloseTime = branch.CloseTime.ToString(),
                        Enabled = branch.Enabled,
                        Add_Country = branch.Add_Country,
                        Add_Province = branch.Add_Province,
                        Add_District = branch.Add_District,
                        Add_Ward = branch.Add_Ward,
                        Add_Detail = branch.Add_Detail,
                        Tables = branch.Tables,
                        SpaceFee = branch.SpaceFee,
                        InternetFee = branch.InternetFee,
                        PhoneNumbers = branch.PhoneNumbers
                        .Select(p => new BranchPhoneNumberViewModel()
                        {
                            Id = p.Id,
                            PhoneNumber = p.PhoneNumber
                        }).ToList()
                    };

                    return CommandResult.SuccessWithData(model);
                }
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
