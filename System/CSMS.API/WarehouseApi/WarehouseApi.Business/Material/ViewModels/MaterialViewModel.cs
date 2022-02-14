using System.Collections.Generic;

namespace WarehouseApi.Business.Material.ViewModels
{
    public class MaterialViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public decimal? Amount { get; set; }

        public List<string> Partners { get; set; }
    }
}
