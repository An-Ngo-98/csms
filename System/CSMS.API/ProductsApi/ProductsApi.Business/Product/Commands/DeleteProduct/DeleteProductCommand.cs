using ProductsApi.Common.Commands;
using ProductsApi.Constants.Message;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Commands.DeleteProduct
{
    public class DeleteProductCommand : IDeleteProductCommand
    {
        private readonly IRepository<CsmsProduct> _productRepository;

        public DeleteProductCommand(IRepository<CsmsProduct> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<CommandResult> ExecuteAsync(int productId)
        {
            try
            {
                CsmsProduct product = await _productRepository.GetByIdAsync(productId);

                if (product != null)
                {
                    product.Deleted = true;
                    await _productRepository.UpdateAsync(product);

                    return CommandResult.Success;
                }

                return CommandResult.Failed(new CommandResultError
                {
                    Code = (int)HttpStatusCode.NotFound,
                    Description = MessageError.NotFound
                });
            }
            catch (Exception ex)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = ex.Message
                });
            }
        }
    }
}
