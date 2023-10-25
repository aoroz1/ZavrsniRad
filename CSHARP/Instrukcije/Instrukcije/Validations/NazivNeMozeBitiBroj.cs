using System.ComponentModel.DataAnnotations;

namespace Instrukcije.Validations
{
    public class NazivNeMozeBitiBroj : ValidationAttribute
    {

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            try
            {
                var broj = decimal.Parse((string)value);
                return new ValidationResult("Naziv ne može biti broj");
            }
            catch (Exception e)
            {

            }
            return ValidationResult.Success;
        }

    }
}