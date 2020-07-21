using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using backend.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;
        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHistory([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            try
            {
                List<HistoryModel> history = await _historyService.GetHistory(page, pageSize, start, end);
                return Ok(history);
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetHistoryCount([FromQuery] int maxAmount, [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            try
            {
                int historyCount = await _historyService.GetHistoryCount(maxAmount, start, end);
                return Ok(historyCount);
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}