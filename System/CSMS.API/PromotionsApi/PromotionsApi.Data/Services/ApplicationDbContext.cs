using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using PromotionsApi.Common.Entities;
using PromotionsApi.Common.Securities;
using PromotionsApi.Data.Entities;

namespace PromotionsApi.Data.Services
{
    public class ApplicationDbContext : DbContext, IDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILoggerFactory _loggerFactory;

        public virtual DbSet<CsmsDevice> CsmsDevice { get; set; }
        public virtual DbSet<CsmsEvent> CsmsEvent { get; set; }
        public virtual DbSet<CsmsEventCategory> CsmsEventCategory { get; set; }
        public virtual DbSet<CsmsEventDevice> CsmsEventDevice { get; set; }
        public virtual DbSet<CsmsEventProduct> CsmsEventProduct { get; set; }
        public virtual DbSet<CsmsEventType> CsmsEventType { get; set; }

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
            modelBuilder.Entity<CsmsDevice>(entity =>
            {
                entity.ToTable("CSMS_Device");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("nvarchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<CsmsEvent>(entity =>
            {
                entity.ToTable("CSMS_Event");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.Code)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.StartTime)
                    .IsRequired()
                    .HasColumnType("datetime");

                entity.Property(e => e.EndTime)
                    .HasColumnType("datetime");

                entity.Property(e => e.StartTimeInDate)
                    .HasColumnType("time(0)");

                entity.Property(e => e.EndTimeInDate)
                    .HasColumnType("time(0)");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnType("nvarchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnType("nvarchar(4000)")
                    .HasMaxLength(4000);

                entity.Property(e => e.DiscountPercent)
                    .HasColumnType("smallint");

                entity.Property(e => e.MaxDiscount)
                    .HasColumnType("int");

                entity.Property(e => e.MinTotalInvoice)
                    .HasColumnType("int");

                entity.Property(e => e.AccountLimit)
                    .HasColumnType("int");

                entity.Property(e => e.QuantityLimit)
                    .HasColumnType("int");

                entity.Property(e => e.Enabled)
                    .IsRequired()
                    .HasDefaultValue(false)
                    .HasColumnType("bit");

                entity.HasOne(d => d.EventType)
                    .WithMany(p => p.Events)
                    .HasForeignKey(d => d.EventTypeId);
            });

            modelBuilder.Entity<CsmsEventCategory>(entity =>
            {
                entity.ToTable("CSMS_Event_Category");

                entity.HasKey(e => new { e.EventId, e.CategoryId });

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.CategoryIds)
                    .HasForeignKey(d => d.EventId);
            });

            modelBuilder.Entity<CsmsEventDevice>(entity =>
            {
                entity.ToTable("CSMS_Event_Device");

                entity.HasKey(e => new { e.EventId, e.DeviceId });

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.EventDevices)
                    .HasForeignKey(d => d.EventId);

                entity.HasOne(d => d.Device)
                    .WithMany(p => p.EventDevices)
                    .HasForeignKey(d => d.DeviceId);
            });

            modelBuilder.Entity<CsmsEventProduct>(entity =>
            {
                entity.ToTable("CSMS_Event_Product");

                entity.HasKey(e => new { e.EventId, e.ProductId });

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.ProductIds)
                    .HasForeignKey(d => d.EventId);
            });

            modelBuilder.Entity<CsmsEventType>(entity =>
            {
                entity.ToTable("CSMS_Event_Type");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnType("nvarchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);
            });
        }
    }
}
