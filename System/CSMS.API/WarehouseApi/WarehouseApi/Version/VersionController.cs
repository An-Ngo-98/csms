using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WarehouseApi.Version
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionController : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetVersionApi()
        {
            return new ObjectResult("Warehouse API version 1.0.0.0");
        }
    }
}
