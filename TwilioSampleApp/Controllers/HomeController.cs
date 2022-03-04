using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Twilio.Jwt.AccessToken;
using Twilio.TwiML;
using Twilio.TwiML.Voice;
using TwilioSampleApp.Models;

namespace TwilioSampleApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult GenerateToken()
        {
             
            string twilioAccountSid = "AC******************************";
            string incomingApiKey = "******************************";
            string incomingApiSecret = "******************************";
            string outgoingApplicationSid = "AP******************************";

            var grant = new VoiceGrant();

            var grants = new HashSet<IGrant> { { grant } };

            grant.OutgoingApplicationSid = outgoingApplicationSid;
            grant.IncomingAllow = true;
            string identity = "JiveLineId";
            string token = new Token(
            twilioAccountSid, incomingApiKey,
            incomingApiSecret, identity,
            grants: grants).ToJwt();
             
            return Json(new {token = token});
        }

        public IActionResult IncomingCall()
        {
            var response = new VoiceResponse();
            Dial dial = new Dial(callerId: "+1**********");
            var client = new Client();
            client.Identity("JiveLineId");
            dial.Append(client);
            response.Append(dial);
            return Content(response.ToString(), "text/xml");
        }

        public IActionResult OutgoingCall(string phoneNumber)
        {
            var response = new VoiceResponse();
            var dial = new Dial(callerId: "+1**********");
            dial.Number(phoneNumber: phoneNumber);
            response.Append(dial);
            return Content(response.ToString(), "text/xml");
        }
         
        public IActionResult Index()
        {
            return View();
        }
          
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}