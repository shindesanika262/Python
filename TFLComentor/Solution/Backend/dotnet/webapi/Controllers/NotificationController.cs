using Hangfire;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.Services.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly bool _hangfireEnabled;

    public NotificationController(
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        _hangfireEnabled =
            configuration.GetValue<bool?>("Hangfire:Enabled")
            ?? !environment.IsDevelopment();
    }

     [HttpPost("send")]
        public IActionResult SendEmail(string email, string passphrase)
        {
            if (!_hangfireEnabled)
            {
                return StatusCode(
                    StatusCodes.Status503ServiceUnavailable,
                    new { message = "Email notifications are unavailable because Hangfire is disabled." });
            }

            BackgroundJob.Enqueue<IEmailService>(
                service => service.SendEmail(email, passphrase)
            );

            return Ok("Email job created.");
        }
}