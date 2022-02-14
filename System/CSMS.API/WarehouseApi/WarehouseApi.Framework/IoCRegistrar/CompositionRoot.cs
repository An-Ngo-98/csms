using DryIoc;
using System;
using System.Net.Http;
using WarehouseApi.Business.Bill.Commands.PayBill;
using WarehouseApi.Business.Bill.Queries.GetListBill;
using WarehouseApi.Business.Material.Commands.SaveMaterial;
using WarehouseApi.Business.Material.Queries.GetListMaterial;
using WarehouseApi.Business.Partner.Commands.SavePartner;
using WarehouseApi.Business.Partner.Queries.GetListPartner;
using WarehouseApi.Business.Partner.Queries.GetPartnerById;
using WarehouseApi.Business.Warehouse.Commands.ExportMaterial;
using WarehouseApi.Business.Warehouse.Commands.ImportMaterial;
using WarehouseApi.Business.Warehouse.Commands.SaveStoreWareHouse;
using WarehouseApi.Business.Warehouse.Commands.SetDefaultExportData;
using WarehouseApi.Business.Warehouse.Commands.SetDefaultImportData;
using WarehouseApi.Business.Warehouse.Queries.GetImportExportHistories;
using WarehouseApi.Business.Warehouse.Queries.GetStoreExportDefault;
using WarehouseApi.Business.Warehouse.Queries.GetStoreWarehouse;
using WarehouseApi.Business.Warehouse.Queries.GetWarehouseMaterial;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Framework.IoCRegistrar
{
    public class CompositionRoot
    {
        public CompositionRoot(IRegistrator registrator)
        {
            // General
            registrator.Register<Lazy<HttpClient>>(Reuse.InWebRequest);
            registrator.Register<IDbContext, ApplicationDbContext>(Reuse.InWebRequest);
            registrator.Register(typeof(IRepository<>), typeof(EfRepository<>), Reuse.InWebRequest);

            // Bill Business
            registrator.Register<IGetListBillQuery, GetListBillQuery>(Reuse.InWebRequest);
            registrator.Register<IPayBillCommand, PayBillCommand>(Reuse.InWebRequest);

            // Material Business
            registrator.Register<IGetListMaterialQuery, GetListMaterialQuery>(Reuse.InWebRequest);
            registrator.Register<ISaveMaterialCommand, SaveMaterialCommand>(Reuse.InWebRequest);

            // Partner Business
            registrator.Register<IGetListPartnerQuery, GetListPartnerQuery>(Reuse.InWebRequest);
            registrator.Register<IGetPartnerByIdQuery, GetPartnerByIdQuery>(Reuse.InWebRequest);
            registrator.Register<ISavePartnerCommand, SavePartnerCommand>(Reuse.InWebRequest);

            // Warehouse Business
            registrator.Register<IGetWarehouseMaterialQuery, GetWarehouseMaterialQuery>(Reuse.InWebRequest);
            registrator.Register<IGetStoreExportDefaultQuery, GetStoreExportDefaultQuery>(Reuse.InWebRequest);
            registrator.Register<IGetImportExportHistoriesQuery, GetImportExportHistoriesQuery>(Reuse.InWebRequest);
            registrator.Register<IGetStoreWarehouseQuery, GetStoreWarehouseQuery>(Reuse.InWebRequest);
            registrator.Register<IImportMaterialCommand, ImportMaterialCommand>(Reuse.InWebRequest);
            registrator.Register<IExportMaterialCommand, ExportMaterialCommand>(Reuse.InWebRequest);
            registrator.Register<ISetDefaultImportDataCommand, SetDefaultImportDataCommand>(Reuse.InWebRequest);
            registrator.Register<ISetDefaultExportDataCommand, SetDefaultExportDataCommand>(Reuse.InWebRequest);
            registrator.Register<ISaveStoreWareHouseCommand, SaveStoreWareHouseCommand>(Reuse.InWebRequest);
        }
    }
}
