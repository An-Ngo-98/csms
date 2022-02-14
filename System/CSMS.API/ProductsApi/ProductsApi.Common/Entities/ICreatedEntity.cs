using System;

namespace ProductsApi.Common.Entities
{
    public interface ICreatedEntity
    {
        DateTime? CreatedAt { get; set; }
        string CreatedBy { get; set; }
    }
}
