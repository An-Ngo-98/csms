using Microsoft.EntityFrameworkCore;
using ProductsApi.Common.Commands;
using ProductsApi.Constants.Message;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ProductsApi.Business.Review.Commands.SaveReview
{
    public class SaveReviewCommand : ISaveReviewCommand
    {
        private readonly IRepository<CsmsVote> _voteRepository;

        public SaveReviewCommand(IRepository<CsmsVote> voteRepository)
        {
            _voteRepository = voteRepository;
        }

        public async Task<CommandResult> ExecuteAsync(CsmsVote model)
        {
            try
            {
                CommandResult isNotValidData = CheckValidData(model);

                if (isNotValidData != null)
                {
                    return isNotValidData;
                }

                CsmsVote vote = await _voteRepository.Table
                    .Where(n => n.Id == model.Id)
                    .Include(n => n.Photos)
                    .SingleOrDefaultAsync();

                if (model.Id != 0 && vote == null)
                {
                    return CommandResult.Failed(new CommandResultError()
                    {
                        Code = (int)HttpStatusCode.NotFound,
                        Description = MessageError.NotFound
                    });
                }

                vote = vote ?? new CsmsVote();
                vote.Fullname = model.Fullname;
                vote.Score = model.Score;
                vote.Title = model.Title;
                vote.Comment = model.Comment;

                if (vote.Id == default)
                {
                    vote.ProductId = model.ProductId;
                    vote.UserId = model.UserId;
                    vote.InvoiceId = model.InvoiceId;
                }

                vote.Photos = new List<CsmsVotePhoto>();

                foreach (var item in model.Photos)
                {
                    vote.Photos.Add(new CsmsVotePhoto()
                    {
                        Id = item.Id,
                        VoteId = item.VoteId,
                        PhotoId = item.PhotoId
                    });
                }

                if (vote.Id == default)
                {
                    await _voteRepository.InsertAsync(vote);
                }
                else
                {
                    await _voteRepository.UpdateAsync(vote);
                }

                return CommandResult.SuccessWithData(vote);
            }
            catch (Exception)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.InternalServerError,
                    Description = MessageError.InternalServerError
                });
            }
        }

        private CommandResult CheckValidData(CsmsVote model)
        {
            if (model == default
                || model.ProductId == default
                || model.UserId == default
                || model.Fullname == default
                || model.Score == default
                || model.Comment == default)
            {
                return CommandResult.Failed(new CommandResultError()
                {
                    Code = (int)HttpStatusCode.BadRequest,
                    Description = MessageError.SomeDataEmptyOrInvalid
                });
            }

            return null;
        }
    }
}
