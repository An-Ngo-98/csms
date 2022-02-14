using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CdnApi.Data.Services
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> TableNoTracking { get; }
        public IQueryable<T> Table { get; }
        ValueTask<T> GetByIdAsync(object id);
        Task<bool> InsertAsync(T entity);
        Task<bool> InsertAsync(IEnumerable<T> entities);
        Task<bool> UpdateAsync(T entity);
        Task<bool> UpdateAsync(IEnumerable<T> entities);
        Task<bool> DeleteAsync(T entity);
        Task<bool> DeleteAsync(IEnumerable<T> entities);
        Task<bool> DeleteAsync(int id);
    }
}