using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace UsersApi.Data.Services
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
