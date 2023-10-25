using System.ComponentModel.DataAnnotations;
using Instrukcije.Validations;

namespace Instrukcije.Models
{
    public class Grupa : Entitet
    {
        [Required(ErrorMessage = "Naziv obavezno")]
        [NazivNeMozeBitiBroj]
        public string? Naziv { get; set; }
        
        public DateTime? DatumPocetka { get; set; }



    }
}
