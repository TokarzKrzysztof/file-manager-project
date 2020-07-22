using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class GlobalSettingsController : ControllerBase
    {
        private readonly IGlobalSettingsService _globalSettingsService;
        public GlobalSettingsController(IGlobalSettingsService globalSettingsService)
        {
            _globalSettingsService = globalSettingsService;

        }

        [HttpGet]
        public async Task<IActionResult> GetGlobalSettings()
        {
            try
            {
                GlobalSettingsModel settings = await _globalSettingsService.GetGlobalSettings();
                return Ok(settings);
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]
        public async Task<IActionResult> SetGlobalSettings([FromBody] GlobalSettingsModel settings)
        {
            try
            {
                await _globalSettingsService.SetGlobalSettings(settings);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}