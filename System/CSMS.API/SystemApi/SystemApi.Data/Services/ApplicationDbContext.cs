using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SystemApi.Common.Entities;
using SystemApi.Common.Securities;
using SystemApi.Data.Entities;

namespace SystemApi.Data.Services
{
    public class ApplicationDbContext : DbContext, IDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILoggerFactory _loggerFactory;

        public virtual DbSet<CsmsBranch> CsmsUser { get; set; }
        public virtual DbSet<CsmsBranchPhoneNumber> CsmsBranchPhoneNumber { get; set; }

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
            modelBuilder.Entity<CsmsBranch>(entity =>
            {
                entity.ToTable("CSMS_Branch");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.ShortName)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .HasColumnType("nvarchar(500)")
                    .HasMaxLength(500);

                entity.Property(e => e.Location)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.OpenTime)
                    .HasColumnType("time(0)");

                entity.Property(e => e.CloseTime)
                    .HasColumnType("time(0)");

                entity.Property(e => e.Enabled)
                    .IsRequired()
                    .HasColumnType("bit");

                entity.Property(e => e.Add_Country)
                    .HasColumnType("nvarchar(50)")
                    .HasMaxLength(50);

                entity.Property(e => e.Add_Province)
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Add_District)
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Add_Ward)
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Add_Detail)
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.Tables)
                    .HasColumnType("nvarchar(1000)")
                    .HasMaxLength(1000);

                entity.Property(e => e.SpaceFee)
                    .IsRequired()
                    .HasColumnType("decimal(10,2)");

                entity.Property(e => e.InternetFee)
                    .IsRequired()
                    .HasColumnType("decimal(10,2)");

                entity.Property(e => e.Deleted)
                    .IsRequired()
                    .HasColumnType("bit");
            });

            modelBuilder.Entity<CsmsBranchPhoneNumber>(entity =>
            {
                entity.ToTable("CSMS_Branch_PhoneNumber");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.PhoneNumbers)
                    .HasForeignKey(d => d.BranchId);
            });
        }
    }
}
