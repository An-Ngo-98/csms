using System;

namespace InvoicesApi.Business.Coin.ViewModels
{
    public class CoinHistoryViewModel
    {
        public DateTime Time { get; set; }
        public int Coins { get; set; }
        public string InvoiceId { get; set; }
        public bool isUsed { get; set; }
        public bool isEarned { get; set; }
    }
}
