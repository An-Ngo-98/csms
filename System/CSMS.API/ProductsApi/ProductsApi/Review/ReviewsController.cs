using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductsApi.Business.Review.Commands.SaveReview;
using ProductsApi.Business.Review.Queries.GetListReviewByProductId;
using ProductsApi.Business.Review.Queries.GetListReviewByUserId;
using ProductsApi.Common.Commands;
using ProductsApi.Data.Entities;

namespace ProductsApi.Review
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IGetListReviewByProductIdQuery _getListReviewByProductIdQuery;
        private readonly IGetListReviewByUserIdQuery _getListReviewByUserIdQuery;
        private readonly ISaveReviewCommand _saveReviewCommand;

        public ReviewsController(
            IGetListReviewByProductIdQuery getListReviewByProductIdQuery,
            IGetListReviewByUserIdQuery getListReviewByUserIdQuery,
            ISaveReviewCommand saveReviewCommand
            )
        {
            _getListReviewByProductIdQuery = getListReviewByProductIdQuery;
            _getListReviewByUserIdQuery = getListReviewByUserIdQuery;
            _saveReviewCommand = saveReviewCommand;
        }

        [AllowAnonymous]
        [HttpGet("product-reviews/{productId:int=0}")]
        public async Task<IActionResult> GetListReviewByProductIdAsync(int productId, int page = 1, int pageSize = 10, int filterType = 0)
        {
            var result = await _getListReviewByProductIdQuery.ExecuteAsync(productId, page, pageSize, filterType);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("user-reviews/{userId:int=0}")]
        public async Task<IActionResult> GetListReviewByUserIdAsync(int userId)
        {
            var result = await _getListReviewByUserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("user-reviews/{userId:int=0}/{orderId}")]
        public async Task<IActionResult> GetListReviewByUserIdOrderIdAsync(int userId, string orderId)
        {
            var result = await _getListReviewByUserIdQuery.ExecuteAsync(userId, orderId);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SaveReviewAsync(CsmsVote model)
        {
            var result = await _saveReviewCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}