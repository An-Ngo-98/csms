using Microsoft.AspNetCore.Mvc;

namespace CSMS.OMS.GatewayApi.Controllers
{
    [Route("api/version")]
    [ApiController]
    public class VersionController : ControllerBase
    {
        [HttpGet]
        public string GetVersion()
        {
            return "OMS version 1.0.0.0";
        }
    }
}