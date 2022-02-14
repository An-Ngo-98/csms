using CdnApi.Business.Category.Commands.UploadCategoryPhoto;
using CdnApi.Business.Category.Queries.GetCategoryPhoto;
using CdnApi.Business.FileDefault.Commands.UploadFileDefault;
using CdnApi.Business.FileDefault.Queries.GetListDefaultFiles;
using CdnApi.Business.FileDefault.Queries.GetPhotoByFileId;
using CdnApi.Business.Product.Commands.DeleteProductPhoto;
using CdnApi.Business.Product.Commands.UploadProductPhoto;
using CdnApi.Business.Product.Queries.GetProductPhoto;
using CdnApi.Business.Store.Commands.UploadStorePhoto;
using CdnApi.Business.Store.Queries.GetStorePhoto;
using CdnApi.Business.User.Commands.UploadUserAvatarCommand;
using CdnApi.Business.User.Queries.GetUserAvatar;
using CdnApi.Data.Services;
using DryIoc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace CdnApi.Framework.IoCRegistrar
{
    public class CompositionRoot
    {
        public CompositionRoot(IRegistrator registrator)
        {
            // General
            registrator.Register<Lazy<HttpClient>>(Reuse.InWebRequest);
            registrator.Register<IDbContext, ApplicationDbContext>(Reuse.InWebRequest);
            registrator.Register(typeof(IRepository<>), typeof(EfRepository<>), Reuse.InWebRequest);

            // Category business
            registrator.Register<IGetCategoryPhotoQuery, GetCategoryPhotoQuery>(Reuse.InWebRequest);
            registrator.Register<IUploadCategoryPhotoCommand, UploadCategoryPhotoCommand>(Reuse.InWebRequest);

            // default file business
            registrator.Register<IUploadFileDefaultCommand, UploadFileDefaultCommand>(Reuse.InWebRequest);
            registrator.Register<IGetListDefaultFilesQuery, GetListDefaultFilesQuery>(Reuse.InWebRequest);
            registrator.Register<IGetPhotoByFileIdQuery, GetPhotoByFileIdQuery>(Reuse.InWebRequest);

            // User Business
            registrator.Register<IGetUserAvatarQuery, GetUserAvatarQuery>(Reuse.InWebRequest);
            registrator.Register<IUploadUserAvatarCommand, UploadUserAvatarCommand>(Reuse.InWebRequest);

            // Product Business
            registrator.Register<IGetProductPhotoQuery, GetProductPhotoQuery>(Reuse.InWebRequest);
            registrator.Register<IUploadProductPhotoCommand, UploadProductPhotoCommand>(Reuse.InWebRequest);
            registrator.Register<IDeleteProductPhotoCommand, DeleteProductPhotoCommand>(Reuse.InWebRequest);

            // Store business
            registrator.Register<IGetStorePhotoQuery, GetStorePhotoQuery>(Reuse.InWebRequest);
            registrator.Register<IUploadStorePhotoCommand, UploadStorePhotoCommand>(Reuse.InWebRequest);
        }
    }
}
