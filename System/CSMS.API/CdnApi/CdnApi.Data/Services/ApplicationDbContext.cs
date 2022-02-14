using CdnApi.Common.Entities;
using CdnApi.Common.Security;
using CdnApi.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CdnApi.Data.Services
{
    public class ApplicationDbContext : DbContext, IDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILoggerFactory _loggerFactory;

        public virtual DbSet<CsmsAdsBanner> CsmsAdsBanner { get; set; }
        public virtual DbSet<CsmsAppPhoto> CsmsAppPhoto { get; set; }
        public virtual DbSet<CsmsCategory> CsmsCategory { get; set; }
        public virtual DbSet<CsmsFilesDefault> CsmsFilesDefault { get; set; }
        public virtual DbSet<CsmsProductsPhoto> CsmsProductsPhoto { get; set; }
        public virtual DbSet<CsmsReport> CsmsReport { get; set; }
        public virtual DbSet<CsmsStore> CsmsStore { get; set; }
        public virtual DbSet<CsmsUsersAvatar> CsmsUsersAvatar { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
            IHttpContextAccessor httpContextAccessor = null, ILoggerFactory loggerFactory = null) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
            _loggerFactory = loggerFactory;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseLoggerFactory(_loggerFactory);
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CsmsAdsBanner>(entity =>
            {
                entity.ToTable("CSMS_Ads_Banner");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.FileSize)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.Filename)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Picture)
                    .IsRequired()
                    .HasColumnType("varbinary(MAX)");

                entity.Property(e => e.FileType)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<CsmsAppPhoto>(entity =>
            {
                entity.ToTable("CSMS_App_Photo");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.FileSize)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.Filename)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Picture)
                    .IsRequired()
                    .HasColumnType("varbinary(MAX)");

                entity.Property(e => e.FileType)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<CsmsCategory>(entity =>
            {
                entity.ToTable("CSMS_Category");

                entity.HasKey(e => e.CategoryId)
                    .HasName("CategoryId");

                entity.Property(e => e.PhotoSize)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.PhotoName)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Photo)
                    .IsRequired()
                    .HasColumnType("varbinary(MAX)");

                entity.Property(e => e.PhotoType)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnType("bit");
            });

            modelBuilder.Entity<CsmsFilesDefault>(entity =>
            {
                entity.ToTable("CSMS_Files_Default");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.DefaultType)
                    .IsRequired()
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Title)
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.FileSize)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.Filename)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.FileContent)
                    .IsRequired()
                    .HasColumnType("varbinary(MAX)");

                entity.Property(e => e.FileType)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .HasColumnType("bit")
                    .HasDefaultValue(true);
            });

            modelBuilder.Entity<CsmsProductsPhoto>(entity =>
            {
                entity.ToTable("CSMS_Products_Photo");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.FileSize)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.Filename)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Picture)
                    .IsRequired()
                    .HasColumnType("varbinary(MAX)");

                entity.Property(e => e.FileType)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .HasColumnType("bit")
                    .HasDefaultValue(true);
            });

            modelBuilder.Entity<CsmsReport>(entity =>
            {
                entity.ToTable("CSMS_Report");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.FileSize)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.Filename)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.FileContent)
                    .IsRequired()
                    .HasColumnType("varbinary(MAX)");

                entity.Property(e => e.FileType)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

                entity.Property(e => e.UpdatedBy)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<CsmsStore>(entity =>
            {
                entity.ToTable("CSMS_Store");

                entity.HasKey(e => e.StoreId)
                    .HasName("CategoryId");

                entity.Property(e => e.PhotoSize)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.PhotoName)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Photo)
                    .IsRequired()
                    .HasColumnType("varbinary(MAX)");

                entity.Property(e => e.PhotoType)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnType("bit");
            });

            modelBuilder.Entity<CsmsUsersAvatar>(entity =>
            {
                entity.ToTable("CSMS_Users_Avatar");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.FileSize)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.Filename)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Picture)
                    .IsRequired()
                    .HasColumnType("varbinary(MAX)");

                entity.Property(e => e.FileType)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);
            });
        }
    }
}
