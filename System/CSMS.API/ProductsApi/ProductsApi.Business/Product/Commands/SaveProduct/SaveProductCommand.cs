using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Product.Queries.GetProductById;
using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Common.Commands;
using ProductsApi.Constants.Message;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Commands.SaveProduct
{
    public class SaveProductCommand : ISaveProductCommand
    {
        private readonly IRepository<CsmsProduct> _productRepository;
        private readonly IGetProductByIdQuery _getProductByIdQuery;
        private List<CsmsProductPhoto> photos;

        public SaveProductCommand(
            IRepository<CsmsProduct> productRepository,
            IGetProductByIdQuery getProductByIdQuery)
        {
            _productRepository = productRepository;
            _getProductByIdQuery = getProductByIdQuery;
            photos = new List<CsmsProductPhoto>();
        }

        public async Task<CommandResult> ExecuteAsync(ProductViewModel model)
        {
            try
            {
                CommandResult isNotValidData = CheckValidData(model);

                if (isNotValidData != null)
                {
                    return isNotValidData;
                }

                CsmsProduct product = await _productRepository.Table
                    .Where(n => n.Id == model.Id)
                    .Include(n => n.Photos)
                    .SingleOrDefaultAsync();

                if (model.Id != 0 && product == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotFound,
                        Description = MessageError.NotFound
                    });
                }

                product = product ?? new CsmsProduct();
                product.CategoryId = model.CategoryId;
                product.Code = model.Code;
                product.Name = model.Name;
                product.AvatarId = model.AvatarId;
                product.Price = model.Price;
                product.ShortDescription = model.ShortDescription;
                product.Description = model.Description;
                product.SearchString = model.SearchString;
                product.Enabled = model.Enabled;

                if (model.Photos != null)
                {
                    foreach (var photo in model.Photos)
                    {
                        photos.Add(new CsmsProductPhoto()
                        {
                            Id = photo.Id,
                            ProductId = model.Id,
                            PhotoId = photo.PhotoId
                        });
                    }
                    product.Photos = photos;
                }

                if (product.Id == 0)
                {
                    await _productRepository.InsertAsync(product);
                }
                else
                {
                    await _productRepository.UpdateAsync(product);
                }

                ProductViewModel productViewModel = await _getProductByIdQuery.ExecuteAsync(product.Id);

                return CommandResult.SuccessWithData(productViewModel);
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

        private CommandResult CheckValidData(ProductViewModel model)
        {
            if (model == default || model.Name == default)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.SomeDataEmptyOrInvalid
                });
            }

            return null;
        }
    }
}
