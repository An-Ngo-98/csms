namespace InvoicesApi.Business.Report.ViewModels
{
    public class VoucherReportViewModel
    {
        public int VoucherId { get; set; }
        public int TotalUsed { get; set; }
        public int TotalSoldProducts { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal Revenue { get; set; }
    }
}
