using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Instrukcije.Validations;

namespace Instrukcije.Models
{
    public class Predmet : Entitet
    {
        [Required(ErrorMessage = "Naziv obavezno")]
        [NazivNeMozeBitiBroj]
        public string? Naziv { get; set; }

        [ForeignKey("grupa")]
        public Grupa? Grupa { get; set; }

        public int? Trajanje { get; set; }
        public decimal? Cijena { get; set; }

        public List<Polaznik> Polaznici { get; set; } = new();


    }
}
