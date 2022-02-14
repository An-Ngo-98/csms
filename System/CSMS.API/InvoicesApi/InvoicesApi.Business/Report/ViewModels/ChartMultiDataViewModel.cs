using System.Collections.Generic;

namespace InvoicesApi.Business.Report.ViewModels
{
    public class ChartMultiDataViewModel
    {
        public string Key { get; set; }
        public List<decimal> Values { get; set; }
    }
}
