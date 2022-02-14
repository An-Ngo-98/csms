using System.Collections.Generic;

namespace InvoicesApi.Common.Commands
{
    public class CommandResult
    {
        private readonly List<CommandResultError> _errors = new List<CommandResultError>();

        public bool Succeeded { get; protected set; }
        public object Data { get; protected set; }

        public IEnumerable<CommandResultError> Errors => _errors;

        public static CommandResult Success { get; } = new CommandResult { Succeeded = true };

        public static CommandResult SuccessWithData(object data)
        {
            return new CommandResult { Succeeded = true, Data = data };
        }

        public static CommandResult Failed(params CommandResultError[] errors)
        {
            var result = new CommandResult { Succeeded = false };
            if (errors != null)
            {
                result._errors.AddRange(errors);
            }
            return result;
        }
    }
}
