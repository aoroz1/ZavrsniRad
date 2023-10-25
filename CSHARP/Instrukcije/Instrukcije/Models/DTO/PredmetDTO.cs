namespace Instrukcije.Models.DTO
{
    public class PredmetDTO
    {
        public int Sifra { get; set; }
        public string? Naziv { get; set; }
        public string? Grupa { get; set; }
        public int? Trajanje { get; set; }
        public int? BrojPolaznika { get; set; }
        public int? SifraGrupa { get; set; }
        public decimal? Cijena { get; set; }
    }
}
