
using Instrukcije.Data;
using Instrukcije.Models;
using Instrukcije.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Instrukcije.Controllers
{

    [ApiController]
    [Route("api/v1/[controller]")]
    public class PolaznikController : ControllerBase
    {

        private readonly InstrukcijeContext _context;

        public PolaznikController(InstrukcijeContext context)
        {
            _context = context;
        }

        /// <response code="200">Sve je u redu</response>
        /// <response code="400">Zahtjev nije valjan (BadRequest)</response> 
        /// <response code="503">Na azure treba dodati IP u firewall</response> 
        [HttpGet]
        public IActionResult Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var polaznici = _context.Polaznik.ToList();
            if (polaznici == null || polaznici.Count == 0)
            {
                return new EmptyResult();
            }

            List<PolaznikDTO> vrati = new();

            polaznici.ForEach(p =>
            {
                // ovo je ručno presipavanje, kasnije upogonimo automapper
                var pdto = new PolaznikDTO()
                {
                    Sifra = p.Sifra,
                    Ime = p.Ime,
                    Prezime = p.Prezime,
                    Oib = p.Oib,
                    Email = p.Email
                };

                vrati.Add(pdto);


            });


            return Ok(vrati);

        }





        /// <response code="200">Sve je u redu</response>
        /// <response code="400">Zahtjev nije valjan (BadRequest)</response> 
        /// <response code="503">Na azure treba dodati IP u firewall</response> 
        [HttpPost]
        public IActionResult Post(PolaznikDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Polaznik p = new Polaznik()
                {
                    Ime = dto.Ime,
                    Prezime = dto.Prezime,
                    Oib = dto.Oib,
                    Email = dto.Email
                };

                _context.Polaznik.Add(p);
                _context.SaveChanges();
                dto.Sifra = p.Sifra;
                return Ok(dto);

            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }




        /// <response code="200">Sve je u redu</response>
        /// <response code="204">Nema u bazi polaznika kojeg želimo promijeniti</response>
        /// <response code="415">Nismo poslali JSON</response> 
        /// <response code="503">Na azure treba dodati IP u firewall</response> 
        [HttpPut]
        [Route("{sifra:int}")]
        public IActionResult Put(int sifra, PolaznikDTO pdto)
        {

            if (sifra <= 0 || pdto == null)
            {
                return BadRequest();
            }

            try
            {
                var polaznikBaza = _context.Polaznik.Find(sifra);
                if (polaznikBaza == null)
                {
                    return BadRequest();
                }
                // inače se rade Mapper-i
                // mi ćemo za sada ručno
                polaznikBaza.Ime = pdto.Ime;
                polaznikBaza.Prezime = pdto.Prezime;
                polaznikBaza.Oib = pdto.Oib;
                polaznikBaza.Email = pdto.Email;

                _context.Polaznik.Update(polaznikBaza);
                _context.SaveChanges();
                pdto.Sifra = polaznikBaza.Sifra;
                return StatusCode(StatusCodes.Status200OK, pdto);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                                  ex); // kada se vrati cijela instanca ex tada na klijentu imamo više podataka o grešci
                // nije dobro vraćati cijeli ex ali za dev je OK
            }


        }


        /// <response code="200">Sve je u redu</response>
        /// <response code="204">Nema u bazi polaznika kojeg želimo obrisati</response>
        /// <response code="415">Nismo poslali JSON</response> 
        /// <response code="503">Na azure treba dodati IP u firewall</response> 
        [HttpDelete]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Delete(int sifra)
        {
            if (sifra <= 0)
            {
                return BadRequest();
            }

            var polaznikBaza = _context.Polaznik.Find(sifra);
            if (polaznikBaza == null)
            {
                return BadRequest();
            }

            try
            {
                _context.Polaznik.Remove(polaznikBaza);
                _context.SaveChanges();

                return new JsonResult("{\"poruka\":\"Obrisano\"}");

            }
            catch (Exception ex)
            {

                return new JsonResult("{\"poruka\":\"Ne može se obrisati\"}");

            }

        }








    }
}