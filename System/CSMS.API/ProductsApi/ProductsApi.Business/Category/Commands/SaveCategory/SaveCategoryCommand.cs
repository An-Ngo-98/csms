using ProductsApi.Common.Commands;
using ProductsApi.Constants.Message;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ProductsApi.Business.Category.Commands.SaveCategory
{
    public class SaveCategoryCommand : ISaveCategoryCommand
    {
        private readonly IRepository<CsmsCategory> _categoryRepository;

        public SaveCategoryCommand(IRepository<CsmsCategory> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CommandResult> ExecuteAsync(CsmsCategory model)
        {
            try
            {
                if (model.Name == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.BadRequest,
                        Description = MessageError.SomeDataEmptyOrInvalid
                    });
                }

                CsmsCategory cat = await _categoryRepository.GetByIdAsync(model.Id);

                if (model.Id != 0 && cat == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotFound,
                        Description = MessageError.NotFound
                    });
                }

                cat = cat ?? new CsmsCategory();
                cat.Name = model.Name;
                cat.Enabled = model.Enabled;

                if (cat.Id == 0)
                {
                    await _categoryRepository.InsertAsync(cat);
                }
                else
                {
                    await _categoryRepository.UpdateAsync(cat);
                }

                return CommandResult.SuccessWithData(cat);
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
