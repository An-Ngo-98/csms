using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WarehouseApi.Business.Partner.Commands.SavePartner;
using WarehouseApi.Business.Partner.Queries.GetListPartner;
using WarehouseApi.Business.Partner.Queries.GetPartnerById;
using WarehouseApi.Business.Partner.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Partner
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnersController : ControllerBase
    {
        private readonly IGetListPartnerQuery _getListPartnerQuery;
        private readonly IGetPartnerByIdQuery _getPartnerByIdQuery;
        private readonly ISavePartnerCommand _savePartnerCommand;

        public PartnersController(
            IGetListPartnerQuery getListPartnerQuery,
            IGetPartnerByIdQuery getPartnerByIdQuery,
            ISavePartnerCommand savePartnerCommand)
        {
            _getListPartnerQuery = getListPartnerQuery;
            _getPartnerByIdQuery = getPartnerByIdQuery;
            _savePartnerCommand = savePartnerCommand;
        }

        [HttpGet("{page:int=1}/{pageSize:int=10}")]
        public async Task<IActionResult> GetPartnersAsync(int page, int pageSize, string searchString)
        {
            var result = await _getListPartnerQuery.ExecuteAsync(page, pageSize, searchString);
            return new ObjectResult(result);
        }

        [HttpGet("{partnerId:int=0}")]
        public async Task<IActionResult> GetPartnerByIdAsync(int partnerId)
        {
            var result = await _getPartnerByIdQuery.ExecuteAsync(partnerId);
            return new ObjectResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> SavePartner(PartnerViewModel model)
        {
            var result = await _savePartnerCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}