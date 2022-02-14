using Microsoft.EntityFrameworkCore;
using PromotionsApi.Business.Event.ViewModels;
using PromotionsApi.Data.Entities;
using PromotionsApi.Data.Services;
using System.Linq;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetEventById
{
    public class GetEventByIdQuery : IGetEventByIdQuery
    {
        private readonly IRepository<CsmsEvent> _eventRepository;

        public GetEventByIdQuery(IRepository<CsmsEvent> eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<GetEventViewModel> ExecuteAsync(int eventId)
        {
            var result = await _eventRepository.TableNoTracking
                .Where(n => n.Id == eventId)
                .Select(n => new GetEventViewModel()
                {
                    Id = n.Id,
                    Code = n.Code,
                    StartTime = n.StartTime,
                    EndTime = n.EndTime,
                    StartTimeInDate = n.StartTimeInDate,
                    EndTimeInDate = n.EndTimeInDate,
                    Title = n.Title,
                    Description = n.Description,
                    EventTypeId = n.EventTypeId,
                    DiscountPercent = n.DiscountPercent,
                    MaxDiscount = n.MaxDiscount,
                    MinTotalInvoice = n.MinTotalInvoice,
                    AccountLimit = n.AccountLimit,
                    QuantityLimit = n.QuantityLimit,
                    AppliedAllProducts = n.AppliedAllProducts,
                    Enabled = n.Enabled,
                    ProductIds = n.ProductIds.Select(n => n.ProductId).ToList(),
                    CategoryIds = n.CategoryIds.Select(x => x.CategoryId).ToList(),
                    DeviceIds = n.EventDevices.Select(x => x.DeviceId).ToList()
                })
                .SingleOrDefaultAsync();

            return result;
        }
    }
}
