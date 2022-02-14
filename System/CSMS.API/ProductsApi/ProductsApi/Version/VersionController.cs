using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProductsApi.Version
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionController : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetVersionApi()
        {
            return new ObjectResult("Products API version 1.0.0.0");
        }
    }
}
