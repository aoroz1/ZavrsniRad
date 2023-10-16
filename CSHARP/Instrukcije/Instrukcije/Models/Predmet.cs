using System.ComponentModel.DataAnnotations.Schema;

namespace Instrukcije.Models
{
    public class Predmet : Entitet
    {
        public string? Naziv { get; set; }

        [ForeignKey("grupa")]
        public Grupa? Grupa { get; set; }

        public int? Trajanje { get; set; }
        public decimal? Cijena { get; set; }

        public List<Polaznik> Polaznici { get; set; } = new();


    }
}
