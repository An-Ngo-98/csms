using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WarehouseApi.Business.Bill.Helpers;
using WarehouseApi.Business.Bill.ViewModels;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Bill.Queries.GetListBill
{
    public class GetListBillQuery : IGetListBillQuery
    {
        private readonly IRepository<CsmsSpendingHistory> _spendingHistoryRepository;
        private readonly IRepository<CsmsImportHistory> _importHistoryRepository;

        public GetListBillQuery(
            IRepository<CsmsSpendingHistory> spendingHistoryRepository,
            IRepository<CsmsImportHistory> importHistoryRepository)
        {
            _spendingHistoryRepository = spendingHistoryRepository;
            _importHistoryRepository = importHistoryRepository;
        }

        public async Task<List<BillViewModel>> ExecuteAsync(int month, int year)
        {
            var paidBills = await _spendingHistoryRepository.TableNoTracking
                .Where(n => n.SpentTime.Month == month && n.SpentTime.Year == year)
                .Select(n => new BillViewModel()
                {
                    BillCode = n.BillCode,
                    BillTime = n.SpentTime,
                    BranchId = n.BranchId,
                    BranchName = n.BranchName,
                    PartnerId = n.PartnerId,
                    PartnerName = n.Partner.Name,
                    HavePaid = true,
                    Remark = n.Remark,
                    SpendType = n.SpendTypeId,
                    SpendTypeName = n.SpendType.TypeName,
                    Total = n.Total
                })
                .ToListAsync();

            #region Import Material (Bills from Partner)
            var importHistories = await _importHistoryRepository.TableNoTracking
                .Where(n =>
                    n.ImportDate.Month == month &&
                    n.ImportDate.Year == year &&
                    n.HavePaid != true)
                .Include(n => n.Partner)
                .ToListAsync();

            if (importHistories.Count > 0)
            {
                var unPaidPartners = importHistories
                    .Where(x => x.PartnerId > 0 && x.HavePaid != true)
                    .GroupBy(p => p.PartnerId)
                    .Select(n => n.First().Partner).ToList();

                foreach (var partner in unPaidPartners)
                {
                    decimal total = importHistories.Where(n => n.PartnerId == partner.Id).Sum(n => n.TotalPrice);
                    if (total > 0)
                    {
                        paidBills.Add(new BillViewModel()
                        {
                            BillCode = SpendType.IM.ToString() + "-" + year.ToString("D2") + "." + month.ToString("D2") + "-" + partner.Id,
                            BillTime = new DateTime(year, month, 01),
                            PartnerId = partner.Id,
                            PartnerName = partner.Name,
                            SpendType = SpendType.IM.ToString(),
                            SpendTypeName = "Import Materials",
                            Total = total
                        });

                        paidBills[paidBills.Count - 1].BillCode += "." + paidBills.Where(n => n.PartnerId == partner.Id).Count();
                    }
                }
            }
            #endregion

            return paidBills;
        }
    }
}
