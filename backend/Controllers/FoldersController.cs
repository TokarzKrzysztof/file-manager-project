using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using backend.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FoldersController : ControllerBase
    {
        private readonly IFoldersService _foldersService;
        public FoldersController(IFoldersService foldersService)
        {
            _foldersService = foldersService;
        }

        [HttpGet]
        public async Task<IActionResult> SearchForFolders([FromQuery] string searchString)
        {
            try
            {
                List<FolderViewModel> folders = await _foldersService.SearchForFolders(searchString);
                return Ok(folders);
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetFoldersTree()
        {
            try
            {
                List<FolderViewModel> folders = await _foldersService.GetFoldersTree();
                return Ok(folders);
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateFolder([FromBody] FolderViewModel folderData)
        {
            try
            {
                int folderId = await _foldersService.CreateFolder(folderData);
                return Ok(folderId);
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFolder([FromBody] FolderViewModel folderData)
        {
            try
            {
                await _foldersService.UpdateFolder(folderData);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]
        public async Task<IActionResult> DeleteFolder([FromQuery] int id)
        {
            try
            {
                await _foldersService.SetFolderUnactive(id);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}