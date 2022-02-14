using Microsoft.EntityFrameworkCore;
using PromotionsApi.Data.Entities;
using PromotionsApi.Data.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetEventTypes
{
    public class GetEventTypeQuery : IGetEventTypeQuery
    {
        private readonly IRepository<CsmsEventType> _eventTypeRepository;

        public GetEventTypeQuery(IRepository<CsmsEventType> eventTypeRepository)
        {
            _eventTypeRepository = eventTypeRepository;
        }

        public Task<List<CsmsEventType>> ExecuteAsync()
        {
            var result = _eventTypeRepository.TableNoTracking.ToListAsync();

            return result;
        }
    }
}
