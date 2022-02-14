using System;

namespace UsersApi.Common.Entities
{
    public interface IUpdatedEntity
    {
        DateTime? UpdatedAt { get; set; }
        string UpdatedBy { get; set; }
    }
}
