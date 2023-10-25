using System.Linq.Expressions;
using System.Text.RegularExpressions;

namespace Instrukcije.Models
{
    public class Polaznik : Entitet
    {
        public string? Ime { get; set; }
        public string? Prezime { get; set; }
        public string? Oib { get; set; }

        public string? Email { get; set; }
        public ICollection<Predmet> Predmeti { get; } = new List<Predmet>();
    }
}
