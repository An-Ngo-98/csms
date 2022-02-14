using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Branch.Queries.GetProductByBranchId;
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

namespace ProductsApi.Business.Branch.Commands.UpdateStoreProduct
{
    public class UpdateStoreProductCommand : IUpdateStoreProductCommand
    {
        private readonly IRepository<CsmsBranchProduct> _branchProductRepository;
        private readonly IGetProductByBranchIdQuery _getProductByBranchIdQuery;

        public UpdateStoreProductCommand(
            IRepository<CsmsBranchProduct> branchProductRepository,
            IGetProductByBranchIdQuery getProductByBranchIdQuery)
        {
            _branchProductRepository = branchProductRepository;
            _getProductByBranchIdQuery = getProductByBranchIdQuery;
        }

        public async Task<CommandResult> ExecuteAsync(int branchId, List<EnableProductViewModel> listProduct)
        {
            try
            {
                listProduct = listProduct ?? new List<EnableProductViewModel>();

                var data = await _branchProductRepository.Table
                    .Where(n => n.BranchId == branchId)
                    .ToListAsync();

                int length = listProduct.Count <= data.Count ? listProduct.Count : data.Count;

                for (int i = 0; i < length; i++)
                {
                    data[i].ProductId = listProduct[i].Id;
                }

                await _branchProductRepository.UpdateAsync(data);

                if (listProduct.Count > data.Count)
                {
                    List<CsmsBranchProduct> insertList = new List<CsmsBranchProduct>();
                    for (int i = data.Count; i < listProduct.Count; i++)
                    {
                        insertList.Add(new CsmsBranchProduct(branchId, listProduct[i].Id));
                    }

                    await _branchProductRepository.InsertAsync(insertList);
                }
                else
                {
                    if (listProduct.Count < data.Count)
                    {
                        List<CsmsBranchProduct> deleteList = new List<CsmsBranchProduct>();
                        deleteList.AddRange(data.GetRange(listProduct.Count, data.Count - listProduct.Count));
                        await _branchProductRepository.DeleteAsync(deleteList);
                    }
                }


                var result = await _getProductByBranchIdQuery.ExecuteAsync(branchId);

                return CommandResult.SuccessWithData(result);
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
