using System.ComponentModel.DataAnnotations;

namespace Instrukcije.Models
{
    public class Grupa : Entitet
    {
        [Required(ErrorMessage = "Naziv obavezno")]
        public string? Naziv { get; set; }
        
        public DateTime? DatumPocetka { get; set; }



    }
}
