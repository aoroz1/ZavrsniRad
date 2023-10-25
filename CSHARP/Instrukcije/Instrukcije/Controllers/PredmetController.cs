using System.Net.Mail;
using System.Net;
using System.Text.RegularExpressions;
using Instrukcije.Data;
using Instrukcije.Models;
using Instrukcije.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Instrukcije.Controllers
{

    [ApiController]
    [Route("api/v1/[controller]")]

    public class PredmetController : ControllerBase
    {
        private readonly InstrukcijeContext _context;
        private readonly ILogger<PredmetController> _logger;

        public PredmetController(InstrukcijeContext context,
            ILogger<PredmetController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("Dohvaćam predmete");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var predmeti = _context.Predmet
                    .Include(g => g.Grupa)
                    .Include(g => g.Polaznici)
                    .ToList();

                if (predmeti == null || predmeti.Count == 0)
                {
                    return new EmptyResult();
                }

                List<PredmetDTO> vrati = new();

                predmeti.ForEach(g =>
                {
                    vrati.Add(new PredmetDTO()
                    {
                        Sifra = g.Sifra,
                        Naziv = g.Naziv,
                        Grupa = g.Grupa?.Naziv,
                        SifraGrupa = g.Grupa?.Sifra,
                        Cijena=g.Cijena,
                        Trajanje=g.Trajanje,
                        BrojPolaznika = g.Polaznici.Count
                    });
                });
                return Ok(vrati);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status503ServiceUnavailable,
                    ex);
            }


        }

        
        [HttpGet]
        [Route("{sifra:int}")]
        public IActionResult GetById(int sifra)
        {
             //ovdje će ići dohvaćanje u bazi


            if (sifra == 0)
            {
                return BadRequest(ModelState);
            }

            var e = _context.Predmet.Include(i => i.Grupa)
              .FirstOrDefault(x => x.Sifra == sifra);

            if (e == null)
            {
                return StatusCode(StatusCodes.Status204NoContent, e); //204
            }

            try
            {
                return new JsonResult(new PredmetDTO()
                {
                    Sifra = e.Sifra,
                    Naziv = e.Naziv,
                    SifraGrupa = e.Grupa == null ? 0 : e.Grupa.Sifra,
                    Grupa = e.Grupa?.Naziv
                }); //200

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message); //204
            }
        }

        
        [HttpPost]
        public IActionResult Post(PredmetDTO predmetDTO)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (predmetDTO.SifraGrupa <= 0)
            {
                return BadRequest(ModelState);
            }

            try
            {

                var grupa = _context.Grupa.Find(predmetDTO.SifraGrupa);

                if (grupa == null)
                {
                    return BadRequest(ModelState);
                }

                Predmet g = new()
                {
                    Naziv = predmetDTO.Naziv,
                    Grupa = grupa,
                    
                };

                _context.Predmet.Add(g);
                _context.SaveChanges();

                predmetDTO.Sifra = g.Sifra;
                predmetDTO.Grupa = grupa.Naziv;

                return Ok(predmetDTO);


            }
            catch (Exception ex)
            {
                return StatusCode(
                   StatusCodes.Status503ServiceUnavailable,
                   ex);
            }

        }


     

        [HttpPut]
        [Route("{sifra:int}")]
        public IActionResult Put(int sifra, PredmetDTO predmetDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            if (sifra <= 0 || predmetDTO == null)
            {
                return BadRequest();
            }

            try
            {
                var grupa = _context.Grupa.Find(predmetDTO.SifraGrupa);

                if (grupa == null)
                {
                    return BadRequest();
                }

                var predmet = _context.Predmet.Find(sifra);

                if (predmet == null)
                {
                    return BadRequest();
                }

                predmet.Naziv = predmetDTO.Naziv;
                predmet.Grupa = grupa;
                

                _context.Predmet.Update(predmet);
                _context.SaveChanges();

                predmetDTO.Sifra = sifra;
                predmetDTO.Grupa = grupa.Naziv;

                return Ok(predmetDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status503ServiceUnavailable,
                    ex.Message);
            }


        }



        [HttpDelete]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Delete(int sifra)
        {
            if (sifra <= 0)
            {
                return BadRequest();
            }

            var predmetBaza = _context.Predmet.Find(sifra);
            if (predmetBaza == null)
            {
                return BadRequest();
            }

            try
            {
                _context.Predmet.Remove(predmetBaza);
                _context.SaveChanges();

                return new JsonResult("{\"poruka\":\"Obrisano\"}");

            }
            catch (Exception ex)
            {

                return new JsonResult("{\"poruka\":\"Ne može se obrisati\"}");

            }
        }



        [HttpGet]
        [Route("{sifra:int}/polaznici")]
        public IActionResult GetPolaznici(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (sifra <= 0)
            {
                return BadRequest();
            }

            try
            {
                var predmet = _context.Predmet
                    .Include(g => g.Polaznici)
                    .FirstOrDefault(g => g.Sifra == sifra);

                if (predmet == null)
                {
                    return BadRequest();
                }

                if (predmet.Polaznici == null || predmet.Polaznici.Count == 0)
                {
                    return new EmptyResult();
                }

                List<PolaznikDTO> vrati = new();
                predmet.Polaznici.ForEach(p =>
                {
                    vrati.Add(new PolaznikDTO()
                    {
                        Sifra = p.Sifra,
                        Ime = p.Ime,
                        Prezime = p.Prezime,
                        Oib = p.Oib,
                        Email = p.Email
                    });
                });
                return Ok(vrati);
            }
            catch (Exception ex)
            {
                return StatusCode(
                        StatusCodes.Status503ServiceUnavailable,
                        ex.Message);
            }


        }

        [HttpPost]
        [Route("{sifra:int}/dodaj/{polaznikSifra:int}")]
        public IActionResult DodajPolaznika(int sifra, int polaznikSifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (sifra <= 0 || polaznikSifra <= 0)
            {
                return BadRequest();
            }

            try
            {

                var predmet = _context.Predmet
                    .Include(g => g.Polaznici)
                    .FirstOrDefault(g => g.Sifra == sifra);

                if (predmet == null)
                {
                    return BadRequest();
                }

                var polaznik = _context.Polaznik.Find(polaznikSifra);

                if (polaznik == null)
                {
                    return BadRequest();
                }

                // napraviti kontrolu da li je taj polaznik već u toj grupi
                predmet.Polaznici.Add(polaznik);

                _context.Predmet.Update(predmet);
                _context.SaveChanges();

                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(
                       StatusCodes.Status503ServiceUnavailable,
                       ex.Message);

            }

        }

        [HttpDelete]
        [Route("{sifra:int}/obrisi/{polaznikSifra:int}")]
        public IActionResult ObrisiPolaznika(int sifra, int polaznikSifra)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (sifra <= 0 || polaznikSifra <= 0)
            {
                return BadRequest();
            }

            try
            {

                var predmet = _context.Predmet
                    .Include(g => g.Polaznici)
                    .FirstOrDefault(g => g.Sifra == sifra);

                if (predmet == null)
                {
                    return BadRequest();
                }

                var polaznik = _context.Polaznik.Find(polaznikSifra);

                if (polaznik == null)
                {
                    return BadRequest();
                }


                predmet.Polaznici.Remove(polaznik);

                _context.Predmet.Update(predmet);
                _context.SaveChanges();

                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(
                       StatusCodes.Status503ServiceUnavailable,
                       ex.Message);

            }

        }












    }
}
