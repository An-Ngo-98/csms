using Microsoft.EntityFrameworkCore;
using PromotionsApi.Business.Event.Queries.GetEventById;
using PromotionsApi.Business.Event.ViewModels;
using PromotionsApi.Common.Commands;
using PromotionsApi.Constants;
using PromotionsApi.Data.Entities;
using PromotionsApi.Data.Services;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Commands.SaveEvent
{
    public class SaveEventCommand : ISaveEventCommand
    {
        private readonly IRepository<CsmsEvent> _eventRepository;
        private readonly IGetEventByIdQuery _getEventByIdQuery;

        public SaveEventCommand(
            IRepository<CsmsEvent> eventRepository,
            IGetEventByIdQuery getEventByIdQuery)
        {
            _eventRepository = eventRepository;
            _getEventByIdQuery = getEventByIdQuery;
        }

        public async Task<CommandResult> ExecuteAsync(GetEventViewModel model)
        {
            try
            {
                if (!DataValid(model))
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.BadRequest,
                        Description = MessageError.SomeDataEmptyOrInvalid
                    });
                }

                var _event = await _eventRepository.Table
                    .Where(n => n.Id == model.Id)
                    .Include(n => n.CategoryIds)
                    .Include(n => n.ProductIds)
                    .Include(n => n.EventDevices)
                    .SingleOrDefaultAsync();

                _event ??= new CsmsEvent();
                _event.Code = model.Code;
                _event.StartTime = model.StartTime == default ? _event.StartTime : model.StartTime;
                _event.EndTime = model.EndTime;
                _event.StartTimeInDate = model.StartTimeInDate;
                _event.EndTimeInDate = model.EndTimeInDate;
                _event.Title = model.Title;
                _event.Description = model.Description;
                _event.EventTypeId = model.EventTypeId;
                _event.DiscountPercent = model.DiscountPercent;
                _event.MaxDiscount = model.MaxDiscount;
                _event.MinTotalInvoice = model.MinTotalInvoice;
                _event.AccountLimit = model.AccountLimit;
                _event.QuantityLimit = model.QuantityLimit;
                _event.AppliedAllProducts = model.AppliedAllProducts;
                _event.Enabled = model.Enabled;
                _event.ProductIds.Clear();
                _event.CategoryIds.Clear();
                _event.EventDevices.Clear();

                foreach (var catId in model.CategoryIds)
                {
                    _event.CategoryIds.Add(new CsmsEventCategory()
                    {
                        EventId = model.Id,
                        CategoryId = catId
                    });
                }

                foreach (var productId in model.ProductIds)
                {
                    _event.ProductIds.Add(new CsmsEventProduct()
                    {
                        EventId = model.Id,
                        ProductId = productId
                    });
                }

                foreach (var deviceId in model.DeviceIds)
                {
                    _event.EventDevices.Add(new CsmsEventDevice()
                    {
                        EventId = model.Id,
                        DeviceId = deviceId
                    });
                }

                if (_event.Id == default)
                {
                    await _eventRepository.InsertAsync(_event);
                    var result = await _eventRepository.TableNoTracking
                        .Where(n => n.Id == _event.Id)
                        .Select(n => new EventViewModel()
                        {
                            Id = n.Id,
                            Code = n.Code,
                            Title = n.Title,
                            Description = n.Description,
                            StartDate = n.StartTime,
                            EndDate = n.EndTime,
                            Enabled = n.Enabled,
                            Platforms = n.EventDevices.Select(x => x.Device.Title).ToList()
                        })
                        .OrderByDescending(n => n.Id)
                        .SingleOrDefaultAsync();

                    return CommandResult.SuccessWithData(result);
                }
                else
                {
                    await _eventRepository.UpdateAsync(_event);
                    var result = await _getEventByIdQuery.ExecuteAsync(_event.Id);

                    return CommandResult.SuccessWithData(result);
                }
            }
            catch (Exception)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = MessageError.InternalServerError
                });
            }
        }

        private bool DataValid(GetEventViewModel model)
        {
            if (model == default
                || model.Id < 0
                || model.Title == default
                || model.Description == default
                || model.EventTypeId == default
                || model.DeviceIds.Count == 0)
            {
                return false;
            }

            return true;
        }
    }
}
