using System.Collections.Generic;
using System.Reflection.Emit;
using Instrukcije.Models;
using Microsoft.EntityFrameworkCore;

namespace Instrukcije.Data
{
    public class InstrukcijeContext : DbContext
    {
        public InstrukcijeContext(DbContextOptions<InstrukcijeContext> opcije)
            : base(opcije)
        {
        }

        public DbSet<Grupa> Grupa { get; set; }
        public DbSet<Polaznik> Polaznik { get; set; }

        public DbSet<Predmet> Predmet { get; set; }

        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            // implementacija veze 1:n
            modelBuilder.Entity<Predmet>().HasOne(g => g.Grupa);

            // implementacjia veze n:n
            modelBuilder.Entity<Predmet>()
                .HasMany(g => g.Polaznici)
                .WithMany(p => p.Predmeti)
                .UsingEntity<Dictionary<string, object>>("clan",
                c => c.HasOne<Polaznik>().WithMany().HasForeignKey("polaznik"),
                c => c.HasOne<Predmet>().WithMany().HasForeignKey("predmet"),
                c => c.ToTable("clan")
                );
        }

    }
}
