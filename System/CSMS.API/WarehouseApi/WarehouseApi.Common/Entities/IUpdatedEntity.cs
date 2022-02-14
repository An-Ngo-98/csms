using System;

namespace WarehouseApi.Common.Entities
{
    public interface IUpdatedEntity
    {
        DateTime? UpdatedAt { get; set; }
        string UpdatedBy { get; set; }
    }
}
