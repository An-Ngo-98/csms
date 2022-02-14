using InvoicesApi.Common.Commands;
using InvoicesApi.Common.Enums;
using InvoicesApi.Constants;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Commands.UpdateStatusOrder
{
    public class UpdateStatusOrderCommand : IUpdateStatusOrderCommand
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public UpdateStatusOrderCommand(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<CommandResult> ExecuteAsync(string orderId, int statusCode)
        {
            try
            {
                DateTime timeNow = DateTime.Now;
                var order = await _orderRepository.Table
                    .Where(n => n.Id == orderId)
                    .Include(n => n.OrderDetails)
                    .SingleOrDefaultAsync();

                if(order == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotFound,
                        Description = MessageError.NotFound
                    });
                }

                switch (statusCode)
                {
                    case (int)OrderStatus.Cooking:
                        order.CookedTime = timeNow;
                        break;

                    case (int)OrderStatus.Shipping:
                        order.CookedTime ??= timeNow;
                        order.ShippedTime = timeNow;
                        break;

                    case (int)OrderStatus.Completed:
                        order.CookedTime ??= timeNow;
                        order.ShippedTime ??= timeNow;
                        order.CompletedTime = timeNow;
                        break;

                    case (int)OrderStatus.Canceled:
                        order.CanceledTime = timeNow;
                        break;
                }

                await _orderRepository.UpdateAsync(order);

                return CommandResult.SuccessWithData(order);
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
    }
}
