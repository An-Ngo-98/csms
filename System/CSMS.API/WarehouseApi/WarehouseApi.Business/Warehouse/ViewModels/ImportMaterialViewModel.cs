using System;
using System.Collections.Generic;
using System.Text;

namespace WarehouseApi.Business.Warehouse.ViewModels
{
    public class ImportMaterialViewModel
    {
        public int? PartnerId { get; set; }
        public int MaterialId { get; set; }
        public decimal QuantityUnit { get; set; }
        public decimal Price { get; set; }
        public bool HavePaid { get; set; }
    }
}
