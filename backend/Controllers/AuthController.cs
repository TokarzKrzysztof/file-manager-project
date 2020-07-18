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

        [HttpGet("getAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                List<UserViewModel> users = await _authService.GetAllUsers();
                return Ok(users);
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
                UserViewModel user = await _authService.Login(email, password);
                return Ok(user);
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
        public async Task<IActionResult> Register([FromBody] UserViewModel userData, [FromQuery] string emailActivationUrl)
        {
            try
            {
                await _authService.Register(userData, emailActivationUrl);
                return Ok();
            }

            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("activateAccount")]
        public async Task<IActionResult> ActivateAccount([FromQuery] Guid token)
        {
            try
            {
                await _authService.ActivateAccount(token);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("deleteAccount")]
        public async Task<IActionResult> DeleteAccount([FromQuery] Guid token, [FromQuery] string password)
        {
            try
            {
                await _authService.SetAccountUnactive(token, password);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeData passwordChangeData, [FromQuery] Guid token)
        {
            try
            {
                await _authService.ChangePassword(token, passwordChangeData);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("remindPassword")]
        public async Task<IActionResult> RemindPassword([FromQuery] string email)
        {
            try
            {
                await _authService.RemindPassword(email);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("disableUsersSystemAccess")]
        public async Task<IActionResult> disableUsersSystemAccess([FromQuery] int[] ids)
        {
            try
            {
                await _authService.disableUsersSystemAccess(ids);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("disableUsersSystemEditing")]
        public async Task<IActionResult> disableUsersSystemEditing([FromQuery] int[] ids)
        {
            try
            {
                await _authService.disableUsersSystemEditing(ids);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}