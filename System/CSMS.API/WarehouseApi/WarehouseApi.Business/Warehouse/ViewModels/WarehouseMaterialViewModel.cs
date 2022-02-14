using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace WarehouseApi.Business.Warehouse.ViewModels
{
    public class WarehouseMaterialViewModel
    {
        public int MaterialId { get; set; }
        public string MaterialName { get; set; }
        public decimal QuantityExists { get { return TotalImportQuantity - TotalExportQuantity; } }
        public string Unit { get; set; }
        public List<WarehousePartnerViewModel> partners { get; set; }

        public int? DefaultPartnerId { get; set; }
        public decimal? DefaultQuantity { get; set; }

        [IgnoreDataMember]
        public decimal TotalImportQuantity { get; set; }
        [IgnoreDataMember]
        public decimal TotalExportQuantity { get; set; }
    }

    public class WarehousePartnerViewModel
    {
        public int PartnerId { get; set; }
        public string PartnerName { get; set; }
        public decimal MaterialPrice { get; set; }
    }
}
