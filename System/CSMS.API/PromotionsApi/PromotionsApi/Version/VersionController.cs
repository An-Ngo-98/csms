using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PromotionsApi.Version
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionController : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetVersionApi()
        {
            return new ObjectResult("Promotions API version 1.0.0.0");
        }
    }
}
