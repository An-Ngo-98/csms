using Microsoft.EntityFrameworkCore;
using PromotionsApi.Business.Event.ViewModels;
using PromotionsApi.Data.Entities;
using PromotionsApi.Data.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetEventByCode
{
    public class GetEventByCodeQuery : IGetEventByCodeQuery
    {
        private readonly IRepository<CsmsEvent> _eventRepository;

        public GetEventByCodeQuery(IRepository<CsmsEvent> eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<AvailableEventViewModel> ExecuteAsync(string code)
        {
            var result = await _eventRepository.TableNoTracking
                .Where(n => n.Code == code)
                .Select(n => new AvailableEventViewModel()
                {
                    Id = n.Id,
                    Code = n.Code,
                    Title = n.Title,
                    Description = n.Description,
                    AccountLimit = n.AccountLimit,
                    AppliedAllProducts = n.AppliedAllProducts,
                    CategoryIds = n.CategoryIds.Select(x => x.CategoryId).ToList(),
                    Devices = n.EventDevices.Select(x => x.Device.Title).ToList(),
                    DiscountPercent = n.DiscountPercent,
                    EndTimeInDate = n.EndTimeInDate,
                    EventTypeCode = n.EventType.Code,
                    MaxDiscount = n.MaxDiscount,
                    MinTotalInvoice = n.MinTotalInvoice,
                    ProductIds = n.ProductIds.Select(n => n.ProductId).ToList(),
                    QuantityLimit = n.QuantityLimit,
                    StartTimeInDate = n.StartTimeInDate
                })
                .FirstOrDefaultAsync();

            return result;
        }
    }
}
