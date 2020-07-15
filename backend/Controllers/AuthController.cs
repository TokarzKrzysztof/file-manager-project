using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;

        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentUser([FromQuery] Guid token)
        {
            try
            {
                UserViewModel user = await _authService.GetCurrentUser(token);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromQuery] string email, [FromQuery] string password)
        {
            try
            {
                Guid userToken = await _authService.Login(email, password);
                return Ok(userToken);
            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("logout")]
        public async Task<IActionResult> Logout([FromQuery] Guid token)
        {
            try
            {
                await _authService.Logout(token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserViewModel userData)
        {
            try
            {
                await _authService.Register(userData);
                return Ok();
            }

            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}