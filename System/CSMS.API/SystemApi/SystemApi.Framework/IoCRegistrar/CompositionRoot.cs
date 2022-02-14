using DryIoc;
using System;
using System.Net.Http;
using SystemApi.Business.Branch.Commands.DeleteBranch;
using SystemApi.Business.Branch.Commands.SaveBranch;
using SystemApi.Business.Branch.Queries.GetBranch;
using SystemApi.Business.Branch.Queries.GetEnableBranch;
using SystemApi.Business.Branch.Queries.GetEnableProvince;
using SystemApi.Data.Services;

namespace SystemApi.Framework.IoCRegistrar
{
    public class CompositionRoot
    {
        public CompositionRoot(IRegistrator registrator)
        {
            // General
            registrator.Register<Lazy<HttpClient>>(Reuse.InWebRequest);
            registrator.Register<IDbContext, ApplicationDbContext>(Reuse.InWebRequest);
            registrator.Register(typeof(IRepository<>), typeof(EfRepository<>), Reuse.InWebRequest);

            // Branch Business
            registrator.Register<IGetBranchQuery, GetBranchQuery>(Reuse.InWebRequest);
            registrator.Register<IGetEnableBranchQuery, GetEnableBranchQuery>(Reuse.InWebRequest);
            registrator.Register<IGetEnableProvinceQuery, GetEnableProvinceQuery>(Reuse.InWebRequest);
            registrator.Register<ISaveBranchCommand, SaveBranchCommand>(Reuse.InWebRequest);
            registrator.Register<IDeleteBranchCommand, DeleteBranchCommand>(Reuse.InWebRequest);

        }
    }
}
