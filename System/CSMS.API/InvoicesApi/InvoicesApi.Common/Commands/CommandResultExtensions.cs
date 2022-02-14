using System.Linq;
using System.Net;

namespace InvoicesApi.Common.Commands
{
    public static class CommandResultExtensions
    {
        public static int? GetFirstErrorCode(this CommandResult commandResult)
        {
            return commandResult.Errors.FirstOrDefault()?.Code;
        }

        public static string GetFirstErrorMessage(this CommandResult commandResult)
        {
            return commandResult.Errors.FirstOrDefault()?.Description;
        }

        public static int GetStatusCode(this CommandResult commandResult)
        {
            return commandResult.Succeeded ? (int)HttpStatusCode.OK : (commandResult.GetFirstErrorCode() ?? (int)HttpStatusCode.InternalServerError);
        }

        public static object GetData(this CommandResult commandResult)
        {
            return commandResult.Succeeded ? (commandResult.Data != null ? commandResult.Data : new { message = "Successfully" }) : new { errorMessage = commandResult.Errors.FirstOrDefault()?.Description };
        }
    }
}
