using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Threading.Tasks;

namespace SystemApi.Data.Services
{
    public interface IDbContext
    {
        ChangeTracker ChangeTracker { get; }
        IModel Model { get; }
        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        Task<int> SaveChangesAsync();
        int SaveChanges();
    }
}
