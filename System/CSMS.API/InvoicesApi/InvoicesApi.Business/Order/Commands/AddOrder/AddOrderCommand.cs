using InvoicesApi.Common.Commands;
using InvoicesApi.Common.Extentions;
using InvoicesApi.Constants;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Commands.AddOrder
{
    public class AddOrderCommand : IAddOrderCommand
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public AddOrderCommand(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<CommandResult> ExecuteAsync(CsmsOrder model)
        {
            try
            {
                DateTime timeNow = DateTime.Now;
                CommandResultError[] errors = GetDataErrors(model);

                if (errors.Length > 0)
                {
                    return CommandResult.Failed(errors);
                }

                model.Id = model.Id.IsEmpty() ? timeNow.ToString("yMMddHHmmss") + "U" + model.UserId.ToString() : model.Id;
                model.OrderedTime = timeNow;

                await _orderRepository.InsertAsync(model);

                return CommandResult.SuccessWithData(model);
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

        private CommandResultError[] GetDataErrors(CsmsOrder model)
        {
            List<CommandResultError> errors = new List<CommandResultError>();

            if (model == null)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "Model cannot null")
                });
            }

            if (model?.UserId == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "UserId")
                });
            }

            if (model != null && model.Fullname.IsEmpty())
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "UserId")
                });
            }

            if (model != null && model.Receiver.IsEmpty())
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "Receiver")
                });
            }

            if (model != null && model.PhoneNumber.IsEmpty())
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "PhoneNumber")
                });
            }

            if (model != null && model.Address.IsEmpty())
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "Address")
                });
            }

            if (model?.MerchandiseSubtotal == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "MerchandiseSubtotal")
                });
            }

            if (model?.ShippingFee == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "ShippingFee")
                });
            }

            if (model?.ShippingService == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "ShippingService")
                });
            }

            if (model?.StoreId == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "StoreId")
                });
            }

            if (model?.StoreCode == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "StoreCode")
                });
            }

            if (model?.Distance == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "Distance")
                });
            }

            if (model?.Total == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "Total")
                });
            }

            if (model?.EarnedCoins == default)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "EarnedCoins")
                });
            }

            if (model != null && model.OrderDetails.Count == 0)
            {
                errors.Add(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.DataIsWrong.Replace("{0}", "OrderDetails")
                });
            }

            return errors.ToArray();
        }
    }
}
