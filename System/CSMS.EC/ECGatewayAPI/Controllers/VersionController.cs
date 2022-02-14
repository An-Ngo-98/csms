using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace GatewayAPI.Controllers
{
    [Route("api/version")]
    [ApiController]
    public class VersionController : ControllerBase
    {
        // GET api/version
        [HttpGet]
        public string GetVersion()
        {
            return "ECW version 1.0.0.0";
        }
    }
}