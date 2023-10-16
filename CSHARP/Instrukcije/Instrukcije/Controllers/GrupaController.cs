
using Instrukcije.Data;
using Instrukcije.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Instrukcije.Controllers
{

    [ApiController]
    [Route("api/v1/[controller]")]
    public class GrupaController : ControllerBase
    {

      
        private readonly InstrukcijeContext _context;

        public GrupaController(InstrukcijeContext context)
        {
            _context = context;
        }

       
        /// <response code="200">Sve je u redu</response>
        /// <response code="400">Zahtjev nije valjan (BadRequest)</response> 
        /// <response code="503">Na azure treba dodati IP u firewall</response> 
        [HttpGet]
        public IActionResult Get()
        {
            // kontrola ukoliko upit nije dobar
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var grupe = _context.Grupa.ToList();
                if (grupe == null || grupe.Count == 0)
                {
                    return new EmptyResult();
                }
                return new JsonResult(_context.Grupa.ToList());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                                    ex.Message);
            }



        }



        /// <response code="200">Sve je u redu</response>
        /// <response code="400">Zahtjev nije valjan (BadRequest)</response> 
        /// <response code="503">Na azure treba dodati IP u firewall</response> 
        [HttpPost]
        public IActionResult Post(Grupa grupa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Grupa.Add(grupa);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, grupa);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                                   ex.Message);
            }



        }




     
        [HttpPut]
        [Route("{sifra:int}")]
        public IActionResult Put(int sifra, Grupa grupa)
        {

            if (sifra <= 0 || grupa == null)
            {
                return BadRequest();
            }

            try
            {
                var grupaBaza = _context.Grupa.Find(sifra);
                if (grupaBaza == null)
                {
                    return BadRequest();
                }
        
                grupaBaza.Naziv = grupa.Naziv;
                grupaBaza.DatumPocetka=grupa.DatumPocetka;

                _context.Grupa.Update(grupaBaza);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, grupaBaza);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                                  ex); // kada se vrati cijela instanca ex tada na klijentu imamo više podataka o grešci
                // nije dobro vraćati cijeli ex ali za dev je OK
            }

        }



        /// <response code="200">Sve je u redu</response>
        /// <response code="204">Nema u bazi smjera kojeg želimo obrisati</response>
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

            var grupaBaza = _context.Grupa.Find(sifra);
            if (grupaBaza == null)
            {
                return BadRequest();
            }

            try
            {
                _context.Grupa.Remove(grupaBaza);
                _context.SaveChanges();

                return new JsonResult("{\"poruka\":\"Obrisano\"}");

            }
            catch (Exception ex)
            {

                return StatusCode(StatusCodes.Status400BadRequest,
                                  "Ne može se obrisati smjer jer ima na sebi grupe");

                // new JsonResult("{\"poruka\":\"Ne može se obrisati\"}");

            }
        }
    }
}