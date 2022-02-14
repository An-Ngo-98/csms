using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProductsApi.Common.Entities;
using ProductsApi.Common.Securities;
using ProductsApi.Data.Entities;

namespace ProductsApi.Data.Services
{
    public class ApplicationDbContext : DbContext, IDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILoggerFactory _loggerFactory;

        public virtual DbSet<CsmsCategory> CsmsCategory { get; set; }
        public virtual DbSet<CsmsProduct> CsmsProduct { get; set; }
        public virtual DbSet<CsmsProductPhoto> CsmsProductPhoto { get; set; }
        public virtual DbSet<CsmsVote> CsmsVote { get; set; }
        public virtual DbSet<CsmsVotePhoto> CsmsVotePhoto { get; set; }

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
            modelBuilder.Entity<CsmsCategory>(entity =>
            {
                entity.ToTable("CSMS_Category");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Enabled)
                    .IsRequired()
                    .HasColumnType("bit");

                entity.Property(e => e.Deleted)
                    .IsRequired()
                    .HasColumnType("bit");
            });

            modelBuilder.Entity<CsmsProduct>(entity =>
            {
                entity.ToTable("CSMS_Product");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.CategoryId)
                    .HasColumnType("int");

                entity.Property(e => e.Code)
                    .HasColumnType("varchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.AvatarId)
                    .HasColumnType("int");

                entity.Property(e => e.Price)
                    .HasColumnType("varchar(20)")
                    .HasMaxLength(20);

                entity.Property(e => e.ShortDescription)
                    .HasColumnType("nvarchar(300)");

                entity.Property(e => e.Description)
                    .HasColumnType("nvarchar(MAX)");

                entity.Property(e => e.Rate)
                    .HasColumnType("decimal(2, 1)");

                entity.Property(e => e.SearchString)
                    .HasColumnType("nvarchar(1000)")
                    .HasMaxLength(1000);

                entity.Property(e => e.Enabled)
                    .IsRequired()
                    .HasColumnType("bit");

                entity.Property(e => e.Deleted)
                    .IsRequired()
                    .HasColumnType("bit");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId);
            });

            modelBuilder.Entity<CsmsProductPhoto>(entity =>
            {
                entity.ToTable("CSMS_Product_Photo");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.ProductId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.PhotoId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Photos)
                    .HasForeignKey(d => d.ProductId);
            });

            modelBuilder.Entity<CsmsVote>(entity =>
            {
                entity.ToTable("CSMS_Vote");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.ProductId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.Fullname)
                    .IsRequired()
                    .HasColumnType("nvarchar(200)")
                    .HasMaxLength(200);

                entity.Property(e => e.Score)
                    .IsRequired()
                    .HasColumnType("decimal(2, 1)");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnType("nvarchar(100)")
                    .HasMaxLength(100);

                entity.Property(e => e.Comment)
                    .IsRequired()
                    .HasColumnType("nvarchar(1000)")
                    .HasMaxLength(1000);

                entity.Property(e => e.VotedDate)
                    .IsRequired()
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.InvoiceId)
                    .HasColumnType("varchar(50)")
                    .HasMaxLength(50);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Votes)
                    .HasForeignKey(d => d.ProductId);
            });

            modelBuilder.Entity<CsmsVotePhoto>(entity =>
            {
                entity.ToTable("CSMS_Vote_Photo");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.VoteId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.PhotoId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.HasOne(d => d.Vote)
                    .WithMany(p => p.Photos)
                    .HasForeignKey(d => d.VoteId);
            });

            modelBuilder.Entity<CsmsBranchProduct>(entity =>
            {
                entity.ToTable("CSMS_Branch_Product");

                entity.HasIndex(e => e.Id)
                       .HasName("Id");

                entity.Property(e => e.BranchId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.Property(e => e.ProductId)
                    .IsRequired()
                    .HasColumnType("int");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.BranchProducts)
                    .HasForeignKey(d => d.ProductId);
            });
        }
    }
}
