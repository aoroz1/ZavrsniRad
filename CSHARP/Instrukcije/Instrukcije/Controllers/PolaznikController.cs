
using Instrukcije.Data;
using Instrukcije.Models;
using Instrukcije.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

            try
            {
                var polaznici = _context.Polaznik.ToList();
                if (polaznici == null || polaznici.Count == 0)
                {
                    return new EmptyResult();
                }

                List<PolaznikDTO> vrati = new();

                var ds = Path.DirectorySeparatorChar;
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "polaznici" + ds);


                polaznici.ForEach(s => {
                    var sdto = new PolaznikDTO();
                    // dodati u nuget automapper ili neki drugi i skužiti kako se s njim radi, sada ručno
                    var putanja = "/slike/prazno.png";
                    if (System.IO.File.Exists(dir + s.Sifra + ".png"))
                    {
                        putanja = "/slike/polaznici/" + s.Sifra + ".png";
                    }

                    vrati.Add(new PolaznikDTO
                    {
                        Sifra = s.Sifra,
                        Ime = s.Ime,
                        Prezime = s.Prezime,
                        Oib = s.Oib,
                        Email = s.Email,
                        Slika = putanja
                    });
                });


                return new JsonResult(vrati); //200

            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, e.Message); //204
            }
        }


        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult GetById(int sifra)
        {
            // ovdje će ići dohvaćanje u bazi


            if (sifra == 0)
            {
                return BadRequest(ModelState);
            }

            var s = _context.Polaznik.Find(sifra);

            if (s == null)
            {
                return StatusCode(StatusCodes.Status204NoContent, s); //204
            }

            try
            {

                var ds = Path.DirectorySeparatorChar;
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "polaznici" + ds);

                var putanja = "/slike/prazno.png";


                if (System.IO.File.Exists(dir + s.Sifra + ".png"))
                {
                    putanja = "/slike/polaznici/" + s.Sifra + ".png";
                }

                var DTO = new PolaznikDTO()
                {
                    Sifra = s.Sifra,
                    Ime = s.Ime,
                    Prezime = s.Prezime,
                    Oib = s.Oib,
                    Email = s.Email,
                    Slika = putanja
                };

                return new JsonResult(DTO); //200

            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, e.Message); //204
            }
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


        [HttpGet]
        [Route("trazi/{uvjet}")]
        public IActionResult TraziPolaznik(string uvjet)
        {
            // ovdje će ići dohvaćanje u bazi

            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var polaznici = _context.Polaznik
                    .Include(p => p.Predmeti)
                    .Where(p => p.Ime.Contains(uvjet) || p.Prezime.Contains(uvjet))

                    // .FromSqlRaw($"SELECT a.* FROM polaznik a left join clan b on a.sifra=b.polaznik where concat(ime,' ',prezime,' ',ime) like '%@uvjet%'",
                    //             new SqlParameter("uvjet", uvjet), new SqlParameter("grupa", grupa))
                    .ToList();
                // (b.grupa is null or b.grupa!=@grupa)  and 
                List<PolaznikDTO> vrati = new();

                polaznici.ForEach(s => {
                    var sdto = new PolaznikDTO();
                    // dodati u nuget automapper ili neki drugi i skužiti kako se s njim radi, sada ručno
                    vrati.Add(new PolaznikDTO
                    {
                        Sifra = s.Sifra,
                        Ime = s.Ime,
                        Prezime = s.Prezime,
                        Oib = s.Oib,
                        Email = s.Email
                    });
                });


                return new JsonResult(vrati); //200

            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, e.Message); //204
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



        [HttpPut]
        [Route("postaviSliku/{sifra:int}")]
        public IActionResult PostaviSliku(int sifra, SlikaDTO slikaDTO)
        {
            if (sifra == 0)
            {
                return BadRequest(); //400
            }

            if (slikaDTO == null || slikaDTO?.Base64?.Length == 0)
            {
                return BadRequest(); //400
            }

            var p = _context.Polaznik.Find(sifra);
            if (p == null)
            {
                return BadRequest(); //400
            }



            try
            {
                var ds = Path.DirectorySeparatorChar;




                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "polaznici");


                if (!System.IO.Directory.Exists(dir))
                {
                    System.IO.Directory.CreateDirectory(dir);
                }


                var putanja = Path.Combine(dir + ds + sifra + ".png");



                System.IO.File.WriteAllBytes(putanja, Convert.FromBase64String(slikaDTO?.Base64));

                return new JsonResult("{\"poruka\": \"Uspješno pohranjena slika\"}");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, e.Message); //204
            }
        }





    }
}


