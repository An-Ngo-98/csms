using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Logging;
using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Data.Entities;
using UsersApi.Common.Entities;
using UsersApi.Common.Securities;

namespace UsersApi.Data.Services
{
    public class ApplicationDbContext : DbContext, IDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILoggerFactory _loggerFactory;

        public virtual DbSet<CsmsUser> CsmsUser { get; set; }
        public virtual DbSet<CsmsUserAddress> CsmsUserAddress { get; set; }
        public virtual DbSet<CsmsRole> CsmsRole { get; set; }
        public virtual DbSet<CsmsPermission> CsmsPermisison { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
            IHttpContextAccessor httpContextAccessor = null, ILoggerFactory loggerFactory = null) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
            _loggerFactory = loggerFactory;
        }

        public override int SaveChanges()
        {
            var validationErrors = ChangeTracker
                .Entries<IValidatableObject>()
                .SelectMany(e => e.Entity.Validate(null))
                .Where(r => r != ValidationResult.Success)
                .ToArray();

            if (validationErrors.Any())
            {
                var exceptionMessage = string.Join(Environment.NewLine, validationErrors.Select(error => string.Format("Properties {0} Error: {1}", error.MemberNames, error.ErrorMessage)));
                throw new Exception(exceptionMessage);
            }

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Added))
            {
                if (entry?.Entity is ICreatedEntity createdEntity)
                {
                    createdEntity.CreatedBy = _httpContextAccessor?.HttpContext?.User?.UserName();
                    createdEntity.CreatedAt = DateTime.UtcNow;
                }
            }

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Modified))
            {
                if (entry?.Entity is IUpdatedEntity updatedEntity)
                {
                    updatedEntity.UpdatedBy = _httpContextAccessor?.HttpContext?.User?.UserName();
                    updatedEntity.UpdatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChanges();
        }

        public Task<int> SaveChangesAsync()
        {
            var validationErrors = ChangeTracker
                .Entries<IValidatableObject>()
                .SelectMany(e => e.Entity.Validate(null))
                .Where(r => r != ValidationResult.Success)
                .ToArray();

            if (validationErrors.Any())
            {
                var exceptionMessage = string.Join(Environment.NewLine, validationErrors.Select(error => string.Format("Properties {0} Error: {1}", error.MemberNames, error.ErrorMessage)));
                throw new Exception(exceptionMessage);
            }

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Added))
            {
                if (entry?.Entity is ICreatedEntity createdEntity)
                {
                    createdEntity.CreatedBy = _httpContextAccessor?.HttpContext?.User?.UserName();
                    createdEntity.CreatedAt = DateTime.UtcNow;
                }
            }

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Modified))
            {
                if (entry?.Entity is IUpdatedEntity updatedEntity)
                {
                    updatedEntity.UpdatedBy = _httpContextAccessor?.HttpContext?.User?.UserName();
                    updatedEntity.UpdatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CsmsUser>(entity =>
            {
                entity.ToTable("CSMS_User");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.UserCode)
                    .HasColumnType("nvarchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.MiddleName)
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.CitizenID)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.Gender)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.Birthday)
                    .HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .HasColumnType("varchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.PhoneNumber)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Username)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Password)
                    .HasColumnType("varchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.Salary)
                    .IsRequired()
                    .HasColumnType("decimal(10,2)");

                entity.Property(e => e.BranchId)
                    .HasColumnType("int");

                entity.Property(e => e.RoleId)
                    .HasColumnType("int");

                entity.Property(e => e.StatusId)
                    .HasColumnType("int");

                entity.Property(e => e.Deleted)
                    .HasColumnType("bit")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.CreateDate)
                    .HasColumnType("datetime");

                entity.Property(e => e.UpdateDate)
                    .HasColumnType("datetime");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<CsmsUserAddress>(entity =>
            {
                entity.ToTable("CSMS_User_Address");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.Receiver)
                    .IsRequired()
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Country)
                    .IsRequired()
                    .HasColumnType("nvarchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Province)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.District)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Ward)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Detail)
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.IsDefault)
                    .HasColumnType("bit")
                    .HasDefaultValueSql("0");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<CsmsUserPermission>(entity =>
            {
                entity.ToTable("CSMS_User_Other_Permission");

                entity.HasKey(e => new { e.UserId, e.PermissionId });

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserOtherPermisisons)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(d => d.Permisison)
                    .WithMany(p => p.UserOtherPermisisons)
                    .HasForeignKey(d => d.PermissionId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<CsmsRole>(entity =>
            {
                entity.ToTable("CSMS_Role");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasColumnType("varchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<CsmsPermission>(entity =>
            {
                entity.ToTable("CSMS_Permission");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.Permission)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Permissions)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<CsmsStatus>(entity =>
            {
                entity.ToTable("CSMS_Status");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.IsBlockAccess)
                    .HasColumnType("bit");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<CsmsLogUserStatus>(entity =>
            {
                entity.ToTable("CSMS_Log_User_Status");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.UserId)
                     .IsRequired()
                     .HasColumnType("int");

                entity.Property(e => e.StatusId)
                     .IsRequired()
                     .HasColumnType("int");

                entity.Property(e => e.ModifiedDate)
                    .IsRequired()
                    .HasColumnType("datetime");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserStatusLogs)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.UserStatusLogs)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}