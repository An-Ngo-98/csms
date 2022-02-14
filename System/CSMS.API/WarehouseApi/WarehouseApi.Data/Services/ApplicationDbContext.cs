using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using WarehouseApi.Common.Entities;
using WarehouseApi.Common.Securities;
using WarehouseApi.Data.Entities;

namespace WarehouseApi.Data.Services
{
    public class ApplicationDbContext : DbContext, IDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILoggerFactory _loggerFactory;

        public virtual DbSet<CsmsExportHistory> CsmsExportHistory { get; set; }
        public virtual DbSet<CsmsImportHistory> CsmsImportHistory { get; set; }
        public virtual DbSet<CsmsMaterial> CsmsMaterial { get; set; }
        public virtual DbSet<CsmsPartner> CsmsPartner { get; set; }
        public virtual DbSet<CsmsPartnerInvoice> CsmsPartnerInvoice { get; set; }
        public virtual DbSet<CsmsPartnerMaterial> CsmsPartnerMaterial { get; set; }
        public virtual DbSet<CsmsSpendingHistory> CsmsSpendingHistory { get; set; }
        public virtual DbSet<CsmsSpendType> CsmsSpendType { get; set; }
        public virtual DbSet<CsmsStoreExportDefault> CsmsStoreExportDefault { get; set; }

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
            modelBuilder.Entity<CsmsExportHistory>(entity =>
            {
                entity.ToTable("CSMS_ExportHistory");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.ExportDate)
                    .IsRequired()
                    .HasColumnType("datetime");

                entity.Property(e => e.MaterialId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.QuantityUnit)
                    .IsRequired()
                    .HasColumnType("decimal(8, 2)");

                entity.Property(e => e.BranchId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.BranchName)
                    .HasMaxLength(200)
                    .HasColumnType("nvarchar(200)");

                entity.HasOne(d => d.Material)
                    .WithMany(p => p.ExportHistories)
                    .HasForeignKey(d => d.MaterialId);
            });

            modelBuilder.Entity<CsmsImportHistory>(entity =>
            {
                entity.ToTable("CSMS_ImportHistory");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.ImportDate)
                    .IsRequired()
                    .HasColumnType("datetime");

                entity.Property(e => e.PartnerId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.MaterialId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.QuantityUnit)
                    .IsRequired()
                    .HasColumnType("decimal(8, 2)");

                entity.Property(e => e.Price)
                    .IsRequired()
                    .HasColumnType("decimal(14, 2)");

                entity.Property(e => e.TotalPrice)
                    .IsRequired()
                    .HasColumnType("decimal(14, 2)");

                entity.Property(e => e.HavePaid)
                    .IsRequired()
                    .HasColumnType("bit");

                entity.HasOne(d => d.Material)
                    .WithMany(p => p.ImportHistories)
                    .HasForeignKey(d => d.MaterialId);

                entity.HasOne(d => d.Partner)
                    .WithMany(p => p.ImportHistories)
                    .HasForeignKey(d => d.PartnerId);
            });

            modelBuilder.Entity<CsmsMaterial>(entity =>
            {
                entity.ToTable("CSMS_Material");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnType("nvarchar(200)");

                entity.Property(e => e.Unit)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnType("nvarchar(20)");

                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(8,2)");

                entity.Property(e => e.DefaultPartnerId)
                    .HasColumnType("int");

                entity.Property(e => e.DefaultQuantity)
                    .HasColumnType("decimal(8,2)");
            });

            modelBuilder.Entity<CsmsPartner>(entity =>
            {
                entity.ToTable("CSMS_Partner");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnType("nvarchar(200)");

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(100)
                    .HasColumnType("varchar(100)");

                entity.Property(e => e.Address)
                    .HasMaxLength(200)
                    .HasColumnType("nvarchar(200)");
            });

            modelBuilder.Entity<CsmsPartnerInvoice>(entity =>
            {
                entity.ToTable("CSMS_PartnerInvoice");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.PartnerId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.InvoiceNo)
                    .HasMaxLength(100)
                    .HasColumnType("varchar(100)");

                entity.Property(e => e.Total)
                    .IsRequired()
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.PaidDate)
                    .IsRequired()
                    .HasColumnType("datetime");

                entity.HasOne(d => d.Partner)
                    .WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.PartnerId);
            });

            modelBuilder.Entity<CsmsPartnerMaterial>(entity =>
            {
                entity.ToTable("CSMS_Partner_Material");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.PartnerId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.MaterialId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.Price)
                    .IsRequired()
                    .HasColumnType("decimal(10, 2)");

                entity.Property(e => e.MaxUnit)
                    .HasColumnType("int");

                entity.HasOne(d => d.Material)
                    .WithMany(p => p.PartnerMaterials)
                    .HasForeignKey(d => d.MaterialId);

                entity.HasOne(d => d.Partner)
                    .WithMany(p => p.PartnerMaterials)
                    .HasForeignKey(d => d.PartnerId);
            });

            modelBuilder.Entity<CsmsSpendingHistory>(entity =>
            {
                entity.ToTable("CSMS_SpendingHistory");

                entity.HasKey(e => e.BillCode);

                entity.Property(e => e.BranchId)
                    .HasColumnType("int");

                entity.Property(e => e.BranchName)
                    .HasMaxLength(200)
                    .HasColumnType("nvarchar(200)");

                entity.Property(e => e.SpendTypeId)
                    .IsRequired()
                    .HasColumnType("string");

                entity.Property(e => e.PartnerId)
                    .HasColumnType("int");

                entity.Property(e => e.Total)
                    .IsRequired()
                    .HasColumnType("decimal(10, 2)");

                entity.Property(e => e.SpentTime)
                    .IsRequired()
                    .HasColumnType("datetime");

                entity.Property(e => e.Remark)
                    .HasMaxLength(1000)
                    .HasColumnType("nvarchar(1000)");

                entity.HasOne(d => d.SpendType)
                    .WithMany(p => p.SpendingHistories)
                    .HasForeignKey(d => d.SpendTypeId);

                entity.HasOne(d => d.Partner)
                    .WithMany(p => p.SpendingHistories)
                    .HasForeignKey(d => d.PartnerId);
            });

            modelBuilder.Entity<CsmsSpendType>(entity =>
            {
                entity.ToTable("CSMS_SpendType");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.TypeName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnType("nvarchar(100)");
            });

            modelBuilder.Entity<CsmsStoreExportDefault>(entity =>
            {
                entity.ToTable("CSMS_Store_Export_Default");

                entity.HasKey(e => new { e.BranchId, e.MaterialId });

                entity.Property(e => e.QuantityUnit)
                    .IsRequired()
                    .HasColumnType("decimal(8,2)");

                entity.HasOne(d => d.Material)
                    .WithMany(p => p.StoreExportDefaults)
                    .HasForeignKey(d => d.MaterialId);
            });

            modelBuilder.Entity<CsmsUsedMaterialLog>(entity =>
            {
                entity.ToTable("CSMS_UsedMaterialLog");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.MaterialId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.BranchId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.BranchName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnType("nvarchar(200)");

                entity.Property(e => e.Amount)
                    .IsRequired()
                    .HasColumnType("decimal(8,2)");

                entity.HasOne(d => d.Material)
                    .WithMany(p => p.StoreUsedLogs)
                    .HasForeignKey(d => d.MaterialId);
            });
        }
    }
}
