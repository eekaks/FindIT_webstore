using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace FindIT.Models
{
    public partial class FindIT_DbContext : DbContext
    {
        public FindIT_DbContext()
        {
        }

        public FindIT_DbContext(DbContextOptions<FindIT_DbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Consultant> Consultants { get; set; }
        public virtual DbSet<Consultant_skills> ConsultantSkills { get; set; }
        public virtual DbSet<Contract> Contracts { get; set; }
        public virtual DbSet<Team> Teams { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=finditdbserver.database.windows.net\\;Database=FindIT_finaldb;User Id=FinalAdmin;Password=finalpassword3!;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Finnish_Swedish_CI_AS");

            modelBuilder.Entity<Consultant>(entity =>
            {
                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Salary).HasColumnType("decimal(18, 0)");
            });

            modelBuilder.Entity<Consultant_skills>(entity =>
            {
                entity.ToTable("Consultant_skills");

                entity.Property(e => e.ConsultantId).HasColumnName("Consultant_Id");

                entity.HasOne(d => d.Consultant)
                    .WithMany(p => p.ConsultantSkills)
                    .HasForeignKey(d => d.ConsultantId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Consultant_skills_Consultants");
            });

            modelBuilder.Entity<Contract>(entity =>
            {
                entity.Property(e => e.Customer_Id).HasColumnName("Customer_Id");

                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime")
                    .HasColumnName("End_Date");

                entity.Property(e => e.StartDate)
                    .HasColumnType("datetime")
                    .HasColumnName("Start_Date");

                entity.Property(e => e.Title).IsRequired();

                entity.Property(e => e.TotalPrice)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("Total_Price");
            });

            modelBuilder.Entity<Team>(entity =>
            {
                entity.Property(e => e.ConsultantId).HasColumnName("Consultant_Id");

                entity.Property(e => e.ContractId).HasColumnName("Contract_Id");

                entity.HasOne(d => d.Consultant)
                    .WithMany(p => p.Teams)
                    .HasForeignKey(d => d.ConsultantId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Teams_Consultants");

                entity.HasOne(d => d.Contract)
                    .WithMany(p => p.Teams)
                    .HasForeignKey(d => d.ContractId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Teams_Contracts");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
