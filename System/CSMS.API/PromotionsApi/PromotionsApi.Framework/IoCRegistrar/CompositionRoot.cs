using DryIoc;
using System;
using System.Net.Http;
using PromotionsApi.Data.Services;
using PromotionsApi.Business.Event.Queries.GetAvailableEvents;
using PromotionsApi.Business.Event.Queries.GetListEvents;
using PromotionsApi.Business.Event.Queries.GetEventById;
using PromotionsApi.Business.Event.Commands.SaveEvent;
using PromotionsApi.Business.Event.Queries.GetEventByCode;
using PromotionsApi.Business.Event.Queries.GetEventTypes;
using PromotionsApi.Business.Event.Queries.GetDevices;

namespace PromotionsApi.Framework.IoCRegistrar
{
    public class CompositionRoot
    {
        public CompositionRoot(IRegistrator registrator)
        {
            // General
            registrator.Register<Lazy<HttpClient>>(Reuse.InWebRequest);
            registrator.Register<IDbContext, ApplicationDbContext>(Reuse.InWebRequest);
            registrator.Register(typeof(IRepository<>), typeof(EfRepository<>), Reuse.InWebRequest);

            // Event Business
            registrator.Register<IGetAvailableEventsQuery, GetAvailableEventsQuery>(Reuse.InWebRequest);
            registrator.Register<IGetListEventsQuery, GetListEventsQuery>(Reuse.InWebRequest);
            registrator.Register<IGetEventByIdQuery, GetEventByIdQuery>(Reuse.InWebRequest);
            registrator.Register<IGetEventByCodeQuery, GetEventByCodeQuery>(Reuse.InWebRequest);
            registrator.Register<IGetEventTypeQuery, GetEventTypeQuery>(Reuse.InWebRequest);
            registrator.Register<IGetDevicesQuery, GetDevicesQuery>(Reuse.InWebRequest);
            registrator.Register<ISaveEventCommand, SaveEventCommand>(Reuse.InWebRequest);
        }
    }
}
