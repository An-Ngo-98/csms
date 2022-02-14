using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using WarehouseApi.Business.Bill.Helpers;
using WarehouseApi.Business.Bill.ViewModels;
using WarehouseApi.Common.Commands;
using WarehouseApi.Constants.Message;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Bill.Commands.PayBill
{
    public class PayBillCommand : IPayBillCommand
    {
        private readonly IRepository<CsmsSpendingHistory> _spendingHistoryRepository;
        private readonly IRepository<CsmsImportHistory> _importHistoryRepository;

        public PayBillCommand(
            IRepository<CsmsSpendingHistory> spendingHistoryRepository,
            IRepository<CsmsImportHistory> importHistoryRepository)
        {
            _spendingHistoryRepository = spendingHistoryRepository;
            _importHistoryRepository = importHistoryRepository;
        }

        public async Task<CommandResult> ExecuteAsync(BillViewModel bill)
        {
            try
            {
                var importHistories = await _importHistoryRepository.Table
                    .Where(n =>
                        n.ImportDate.Year == bill.BillTime.Year &&
                        n.ImportDate.Month == bill.BillTime.Month &&
                        n.PartnerId == bill.PartnerId &&
                        n.HavePaid != true)
                    .ToListAsync();

                foreach (var item in importHistories)
                {
                    item.HavePaid = true;
                }

                CsmsSpendingHistory newBill = new CsmsSpendingHistory()
                {
                    BillCode = bill.BillCode,
                    PartnerId = bill.PartnerId,
                    Remark = bill.Remark,
                    SpendTypeId = SpendType.IM.ToString(),
                    SpentTime = bill.BillTime,
                    Total = bill.Total.Value
                };

                await _importHistoryRepository.UpdateAsync(importHistories);
                await _spendingHistoryRepository.InsertAsync(newBill);

                return CommandResult.Success;
            }
            catch (System.Exception)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = MessageError.InternalServerError
                });
            }
        }
    }
}
