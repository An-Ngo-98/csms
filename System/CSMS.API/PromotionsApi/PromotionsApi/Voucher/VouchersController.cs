using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PromotionsApi.Business.Event.Commands.SaveEvent;
using PromotionsApi.Business.Event.Queries.GetAvailableEvents;
using PromotionsApi.Business.Event.Queries.GetDevices;
using PromotionsApi.Business.Event.Queries.GetEventByCode;
using PromotionsApi.Business.Event.Queries.GetEventById;
using PromotionsApi.Business.Event.Queries.GetEventTypes;
using PromotionsApi.Business.Event.Queries.GetListEvents;
using PromotionsApi.Business.Event.ViewModels;
using PromotionsApi.Common.Commands;
using PromotionsApi.Data.Entities;

namespace PromotionsApi.Voucher
{
    [Route("api/[controller]")]
    [ApiController]
    public class VouchersController : ControllerBase
    {
        private readonly IGetAvailableEventsQuery _getAvailableEventsQuery;
        private readonly IGetListEventsQuery _getListEventsQuery;
        private readonly IGetEventByIdQuery _getEventByIdQuery;
        private readonly IGetEventByCodeQuery _getEventByCodeQuery;
        private readonly IGetDevicesQuery _getDeviceQuery;
        private readonly IGetEventTypeQuery _getEventTypeQuery;
        private readonly ISaveEventCommand _saveEventCommand;

        public VouchersController(
            IGetAvailableEventsQuery getAvailableEventsQuery,
            IGetListEventsQuery getListEventsQuery,
            IGetEventByIdQuery getEventByIdQuery,
            IGetEventByCodeQuery getEventByCodeQuery,
            IGetDevicesQuery getDeviceQuery,
            IGetEventTypeQuery getEventTypeQuery,
            ISaveEventCommand saveEventCommand)
        {
            _getAvailableEventsQuery = getAvailableEventsQuery;
            _getListEventsQuery = getListEventsQuery;
            _getEventByIdQuery = getEventByIdQuery;
            _getEventByCodeQuery = getEventByCodeQuery;
            _getDeviceQuery = getDeviceQuery;
            _getEventTypeQuery = getEventTypeQuery;
            _saveEventCommand = saveEventCommand;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAvailableEventsAsync()
        {
            var result = await _getAvailableEventsQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("{page:int=1}/{pageSize:int=10}")]
        public async Task<IActionResult> GetListEventssAsync(int page, int pageSize, int searchBy, string startDate, string endDate, string searchString)
        {
            var result = await _getListEventsQuery.ExecuteAsync(page, pageSize, searchBy, startDate, endDate, searchString);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("{eventId:int=0}")]
        public async Task<IActionResult> GetEventByIdAsync(int eventId)
        {
            var result = await _getEventByIdQuery.ExecuteAsync(eventId);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("{eventCode}")]
        public async Task<IActionResult> GetEventByCodeAsync(string eventCode)
        {
            var result = await _getEventByCodeQuery.ExecuteAsync(eventCode);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("event-types")]
        public async Task<IActionResult> GetEventTypesAsync(int eventId)
        {
            var result = await _getEventTypeQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("devices")]
        public async Task<IActionResult> GetDevicesAsync(int eventId)
        {
            var result = await _getDeviceQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SaveEventAsync(GetEventViewModel model)
        {
            var result = await _saveEventCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}