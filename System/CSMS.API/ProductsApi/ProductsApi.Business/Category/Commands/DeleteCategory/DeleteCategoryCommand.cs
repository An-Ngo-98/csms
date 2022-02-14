using ProductsApi.Common.Commands;
using ProductsApi.Constants.Message;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ProductsApi.Business.Category.Commands.DeleteCategory
{
    public class DeleteCategoryCommand : IDeleteCategoryCommand
    {
        private readonly IRepository<CsmsCategory> _categoryRepository;

        public DeleteCategoryCommand(IRepository<CsmsCategory> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int catId)
        {
            try
            {
                CsmsCategory cat = await _categoryRepository.GetByIdAsync(catId);

                if (cat != null)
                {
                    cat.Deleted = true;
                    await _categoryRepository.UpdateAsync(cat);

                    return CommandResult.Success;
                }

                return CommandResult.Failed(new CommandResultError
                {
                    Code = (int)HttpStatusCode.NotFound,
                    Description = MessageError.NotFound
                });
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
