using System.ComponentModel.DataAnnotations;

namespace Instrukcije.Models
{
    public abstract class Entitet
    {
        [Key]
        public int Sifra { get; set; }
    }
}