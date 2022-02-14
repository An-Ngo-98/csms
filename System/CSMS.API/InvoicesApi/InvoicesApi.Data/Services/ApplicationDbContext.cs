using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InvoicesApi.Common.Entities;
using InvoicesApi.Common.Securities;
using InvoicesApi.Data.Entities;

namespace InvoicesApi.Data.Services
{
    public class ApplicationDbContext : DbContext, IDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILoggerFactory _loggerFactory;

        public virtual DbSet<CsmsOrder> CsmsOrder { get; set; }
        public virtual DbSet<CsmsOrderDetail> CsmsOrderDetail { get; set; }

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
            modelBuilder.Entity<CsmsOrder>(entity =>
            {
                entity.ToTable("CSMS_Order");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.Fullname)
                    .IsRequired()
                    .HasColumnType("nvarchar(500)")
                    .HasMaxLength(500);

                entity.Property(e => e.Receiver)
                    .IsRequired()
                    .HasColumnType("nvarchar(500)")
                    .HasMaxLength(500);

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasColumnType("nvarchar(2000)")
                    .HasMaxLength(2000);

                entity.Property(e => e.NoteToChef)
                    .HasColumnType("nvarchar(4000)")
                    .HasMaxLength(4000);

                entity.Property(e => e.MerchandiseSubtotal)
                    .IsRequired()
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ShippingFee)
                    .IsRequired()
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ShippingService)
                    .IsRequired()
                    .HasColumnType("nvarchar(500)")
                    .HasMaxLength(500);

                entity.Property(e => e.StoreId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.StoreCode)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.StoreName)
                    .HasColumnType("nvarchar(500)")
                    .HasMaxLength(500);

                entity.Property(e => e.Distance)
                    .IsRequired()
                    .HasColumnType("decimal(6, 1)");

                entity.Property(e => e.ShippingNote)
                    .HasColumnType("nvarchar(4000)")
                    .HasMaxLength(4000);

                entity.Property(e => e.VoucherId)
                    .HasColumnType("int");

                entity.Property(e => e.VoucherCode)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.DiscountPercent)
                    .HasColumnType("smallint");

                entity.Property(e => e.UsedCoins)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.DiscountShippingFee)
                    .IsRequired()
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.DiscountVoucherApplied)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.IsFreeShipVoucher)
                    .IsRequired()
                    .HasColumnType("bit");

                entity.Property(e => e.Total)
                    .IsRequired()
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.EarnedCoins)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.OrderedTime)
                    .IsRequired()
                    .HasColumnType("datetime");

                entity.Property(e => e.CookedTime)
                    .HasColumnType("datetime");

                entity.Property(e => e.ShippedTime)
                    .HasColumnType("datetime");

                entity.Property(e => e.CompletedTime)
                    .HasColumnType("datetime");

                entity.Property(e => e.CanceledTime)
                    .HasColumnType("datetime");
            });

            modelBuilder.Entity<CsmsOrderDetail>(entity =>
            {
                entity.ToTable("CSMS_OrderDetail");

                entity.HasKey(e => new { e.OrderId, e.ProductId });

                entity.Property(e => e.ProductName)
                    .IsRequired()
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.CategoryId)
                    .HasColumnType("int");

                entity.Property(e => e.CategoryName)
                   .HasColumnType("nvarchar(200)")
                   .HasMaxLength(200);

                entity.Property(e => e.Quantity)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.Price)
                    .IsRequired()
                    .HasColumnType("decimal(10, 2)");

                entity.Property(e => e.OriginalPrice)
                    .HasColumnType("decimal(10, 2)");

                entity.Property(e => e.PhotoId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrderDetails)
                    .HasForeignKey(d => d.OrderId);
            });
        }
    }
}
