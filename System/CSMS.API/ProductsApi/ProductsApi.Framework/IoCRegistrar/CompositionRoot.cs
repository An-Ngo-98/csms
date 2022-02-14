using DryIoc;
using System;
using System.Net.Http;
using ProductsApi.Data.Services;
using ProductsApi.Business.Product.Queries.GetListProduct;
using ProductsApi.Business.Product.Queries.GetProductById;
using ProductsApi.Business.Product.Commands.SaveProduct;
using ProductsApi.Business.Product.Commands.DeleteProduct;
using ProductsApi.Business.Category.Queries.GetEnableCategory;
using ProductsApi.Business.Category.Queries.GetListCategory;
using ProductsApi.Business.Category.Commands.DeleteCategory;
using ProductsApi.Business.Category.Commands.SaveCategory;
using ProductsApi.Business.Product.Queries.GetEnableProduct;
using ProductsApi.Business.Branch.Queries.GetProductByBranchId;
using ProductsApi.Business.Branch.Commands.UpdateStoreProduct;
using ProductsApi.Business.Review.Queries.GetListReviewByProductId;
using ProductsApi.Business.Review.Commands.SaveReview;
using ProductsApi.Business.Review.Queries.GetListReviewByUserId;

namespace ProductsApi.Framework.IoCRegistrar
{
    public class CompositionRoot
    {
        public CompositionRoot(IRegistrator registrator)
        {
            // General
            registrator.Register<Lazy<HttpClient>>(Reuse.InWebRequest);
            registrator.Register<IDbContext, ApplicationDbContext>(Reuse.InWebRequest);
            registrator.Register(typeof(IRepository<>), typeof(EfRepository<>), Reuse.InWebRequest);

            // Category Business
            registrator.Register<IGetEnableCategoryQuery, GetEnableCategoryQuery>(Reuse.InWebRequest);
            registrator.Register<IGetListCategoryQuery, GetListCategoryQuery>(Reuse.InWebRequest);
            registrator.Register<ISaveCategoryCommand, SaveCategoryCommand>(Reuse.InWebRequest);
            registrator.Register<IDeleteCategoryCommand, DeleteCategoryCommand>(Reuse.InWebRequest);

            // Product Business
            registrator.Register<IGetListProductQuery, GetListProductQuery>(Reuse.InWebRequest);
            registrator.Register<IGetEnableProductQuery, GetEnableProductQuery>(Reuse.InWebRequest);
            registrator.Register<IGetProductByIdQuery, GetProductByIdQuery>(Reuse.InWebRequest);
            registrator.Register<ISaveProductCommand, SaveProductCommand>(Reuse.InWebRequest);
            registrator.Register<IDeleteProductCommand, DeleteProductCommand>(Reuse.InWebRequest);

            // Branch Business
            registrator.Register<IGetProductByBranchIdQuery, GetProductByBranchIdQuery>(Reuse.InWebRequest);
            registrator.Register<IUpdateStoreProductCommand, UpdateStoreProductCommand>(Reuse.InWebRequest);

            // Review Business
            registrator.Register<IGetListReviewByProductIdQuery, GetListReviewByProductIdQuery>(Reuse.InWebRequest);
            registrator.Register<IGetListReviewByUserIdQuery, GetListReviewByUserIdQuery>(Reuse.InWebRequest);
            registrator.Register<ISaveReviewCommand, SaveReviewCommand>(Reuse.InWebRequest);
        }
    }
}
